const path = require("path"),
  fs = require("fs-extra"),
  archiver = require("archiver");

const sockets = require("./core/sockets"),
  dev = require("./core/dev-log"),
  cache = require("./core/cache"),
  api = require("./core/api"),
  file = require("./core/file"),
  exporter = require("./core/exporter"),
  importer = require("./core/importer"),
  remote_api = require("./core/remote_api");

module.exports = function (app) {
  /**
   * routing event
   */
  app.get("/", load_index);
  app.get("/:slug", load_index);
  app.get("/_archives/:type/:slugFolderName", downloadArchive);
  app.post("/_file-upload/:type/:slugFolderName", postFile);

  remote_api.init(app);

  function collaborativeEditing(ws, req) {
    console.log("WebSocket sharedb event");

    ws.on("message", (msg) => {
      console.log("WebSocket was closed");
      ws.send(msg);
    });

    ws.on("close", () => {
      console.log("WebSocket was closed");
    });
  }

  function generatePageData(req) {
    return new Promise(function (resolve, reject) {
      let fullUrl = req.protocol + "://" + req.get("host") + req.originalUrl;
      dev.log(`••• the following page has been requested: ${fullUrl} •••`);

      let pageData = {};

      pageData.pageTitle = global.appInfos.productName;
      // full path on the storage space, as displayed in the footer
      pageData.folderPath = api.getFolderPath();
      pageData.slugFolderName = "";
      pageData.url = req.path;
      pageData.protocol = req.protocol;
      pageData.structure = global.settings.structure;
      pageData.isDebug = dev.isDebug();

      pageData.store = Object.keys(global.settings.structure).reduce(
        (acc, k) => {
          acc[k] = {};
          return acc;
        },
        {}
      );

      pageData.mode = "live";

      resolve(pageData);
    });
  }

  // GET
  function load_index(req, res) {
    generatePageData(req).then(
      (pageData) => {
        res.render("index", pageData);
      },
      (err) => {
        dev.error(`Err while getting index data: ${err}`);
      }
    );
  }

  function downloadArchive(req, res) {
    let type = req.param("type");
    let slugFolderName = req.param("slugFolderName");

    // check if folder is protected
    file
      .getFolder({ type: type, slugFolderName })
      .then((foldersData) => {
        const folder_meta = Object.values(foldersData)[0];
        if (!folder_meta.hasOwnProperty("password") || !folder_meta.password) {
          return;
        }
        // if it is, check that we have a socketid with the request and if so, if that id is allowed to access that folder
        if (!req.query.hasOwnProperty("pwd")) {
          throw "Missing password for protected folder";
        }
        const pwd = req.query.pwd;

        if (String(auth.hashCode(folder_meta.password)) !== String(pwd)) {
          throw "Wrong password for folder";
        }

        return;
      })
      .then(() => {
        dev.log(
          `Will create and stream archive for folder ${type}/${slugFolderName}`
        );

        // checks passed
        var archive = archiver("zip", {
          zlib: { level: 0 }, //
        });

        archive.on("error", function (err) {
          res.status(500).send({ error: err.message });
        });

        //on stream closed we can end the request
        archive.on("end", function () {
          dev.log("Archive wrote %d bytes", archive.pointer());
        });

        //set the archive name
        res.attachment(slugFolderName + ".zip");

        //this is the streaming magic
        archive.pipe(res);

        const baseFolderPath = global.settings.structure[type].path;
        const mainFolderPath = api.getFolderPath(baseFolderPath);
        const thisFolderPath = path.join(mainFolderPath, slugFolderName);

        archive.directory(thisFolderPath, false);

        archive.finalize();
      })
      .catch((err) => {
        dev.error(`Error! ${err}`);
        res.status(500).send({ error: err });
      });
  }

  async function postFile(req, res) {
    let type = req.params.type;
    let slugFolderName = req.params.slugFolderName;

    importer
      .handleForm({ req, type, slugFolderName })
      .then(({ msg }) => {
        sockets.notify({
          socketid: req.query.socketid,
          localized_string: `imported_files_successfully`,
          type: "success",
        });
        res.end(JSON.stringify(msg));
      })
      .catch(({ err }) => {
        sockets.notify({
          socketid: req.query.socketid,
          localized_string: `action_not_allowed`,
          not_localized_string: err.message,
          type: "error",
        });
        res.end();
      });
  }
};
