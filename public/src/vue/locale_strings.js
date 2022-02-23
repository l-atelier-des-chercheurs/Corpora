module.exports = (function () {
  // Ready translated locale messages
  const messages = {
    ascending: {
      fr: "Croissant",
      en: "Ascending",
      nl: "Toenemend",
      oc: "Creissent",
      de: "Aufsteigend",
    },
    bytes: {
      fr: "octets",
      en: "bytes",
      nl: "bytes",
      oc: "octets",
      de: "Bytes",
    },
    kb: {
      fr: "ko",
      en: "KB",
      nl: "kb",
      oc: "ko",
      de: "KB",
    },
    mb: {
      fr: "Mo",
      en: "MB",
      nl: "Mb",
      oc: "Mo",
      de: "MB",
    },
    gb: {
      fr: "Go",
      en: "GB",
      nl: "Gb",
      oc: "Go",
      de: "GB",
    },
    duration: {
      fr: "Durée",
      en: "Duration",
      nl: "Duur",
      oc: "Durada",
      de: "Dauer",
    },
    feedbacks: {
      fr: "Retours/aide ✉️",
      en: "Feedback ✉️",
    },
    link: {
      fr: "Lien",
      en: "Link",
    },
    learn_more: {
      fr: "Plus d’informations",
      en: "Learn more",
    },
    I_agree: {
      fr: "OK",
      en: "I agree",
    },
    fragment_included_in_collections: {
      fr: "Ce récit est présent dans les collections suivantes",
      en: "This story is part of the following collections",
    },
    fragment_included_in_no_collections: {
      fr: "Ce récit ne fait partie d’aucune collection.",
      en: "This story isn’t part of any collections.",
    },
    fragment_in_all_collections_already: {
      fr: "Ce récit figure déjà dans toutes les collections",
      en: "This fragment is already included in all collections",
    },
    create_a_collection: {
      fr: "Créer une collection",
      en: "Create a collection",
    },
    create_collection_first: {
      fr: "Créez d’abord une collection en fermant cette page.",
      en: "Create a collection first by closing this page.",
    },
    create_your_collection: {
      fr: "créez votre collection",
      en: "create your collection",
    },
    add_to_your_collection: {
      fr: "ajouter à une collection",
      en: "add to your collection",
    },
    edit_collection: {
      fr: "Ajouter/retirer d’une collection",
      en: "Add/remove from a collection",
    },
    add_story_to_collection: {
      fr: "Ajouter ce récit à une collection",
      en: "Add this story to a collection",
    },
    search_in_fragments: {
      fr: "Rechercher",
      en: "Search",
    },
    show_fragments: {
      fr: "Afficher les récits",
      en: "Show all stories",
    },
    fragments: {
      fr: "Récits",
      en: "Stories",
    },
    embed: {
      fr: "Intégration",
      en: "Embed",
    },
    load: {
      fr: "Charger",
      en: "Load",
    },
    load_player: {
      fr: "Afficher le lecteur",
      en: "Load player",
    },
    hide_player: {
      fr: "Masquer le lecteur",
      en: "Hide player",
    },
    file_max_size: {
      fr: "Taille max. des fichiers",
      en: "Max file size",
    },
    sort_fragments_by: {
      fr: "Classer les récits par",
      en: "Sort stories by",
    },
    personal_data_and_legal_notices: {
      fr: "Cookies, données personnelles et mentions légales",
      en: "Cookies, personal data and legal notices",
    },
    website_uses_cookies: {
      fr: "Ce site utilise des cookies pour permettre la navigation.",
      en: "This website uses cookies only to facilitate navigation.",
    },
    created_on: {
      fr: "Créé le",
      en: "Created on",
    },
    close: {
      fr: "Fermer",
      en: "Close",
    },
    results: {
      fr: "résultats",
      en: "results",
    },
    no_results: {
      fr: "Aucun récit ne correspond à votre recherche",
      en: "No results match your criteria(s)",
    },
    text_search: {
      fr: "Recherche de texte",
      en: "Text search",
    },
    created: {
      fr: "Créé",
      en: "Created",
    },
    edit: {
      fr: "Éditer",
      en: "Edit",
    },
    modify: {
      fr: "Modifier",
      en: "Modify",
    },
    edit_mode: {
      fr: "Mode édition",
      en: "Edit mode",
    },
    edit_corpus: {
      fr: "Éditer le corpus",
      en: "Edit corpus",
    },
    edited: {
      fr: "Dernière modification",
      en: "Last edit",
    },
    last_edited_on: {
      fr: "Dernière modification le",
      en: "Last edit on",
    },
    legal_notice: {
      fr: "Mentions légales et données personnelles",
      en: "Legal notices and personal data",
    },
    new_source_name: {
      fr: "Nom de la nouvelle source",
      en: "Name of the new source",
    },
    name: {
      fr: "Nom",
      en: "Name",
    },
    guide: {
      fr: "Guide d’utilisation",
      en: "How to use",
    },
    about_corpus: {
      fr: "À propos de ce corpus",
      en: "About this corpus",
    },
    corpus_default_view: {
      fr: "Mode d’affichage du Corpus",
      en: "Corpus default view",
    },
    corpus_default_view_instructions: {
      fr: "Indiquer ici les paramètres qui seront chargés à l’ouverture de la page d’accueil du corpus. Exemple : si le lien est https://platform.plurality-university.org/clothes?tag_search=Body, écrire ?tag_search=Body",
      en: "Write here the parameters to use. For example: https://platform.plurality-university.org/clothes?tag_search=Body -> ?tag_search=Body",
    },
    title: {
      fr: "Titre",
      en: "Title",
    },
    date_created: {
      fr: "Date de création",
      en: "Date created",
    },
    protected_by_pass: {
      fr: "Protégé par mot de passe",
      en: "Protected by password",
    },
    filter_by_source_of_contribution: {
      fr: "Filtrer par source de contribution",
      en: "Filter by source of contribution",
    },
    source_of_contribution: {
      fr: "Source de contribution",
      en: "Source of contribution",
    },
    display_options: {
      fr: "Options d’affichage",
      en: "Display options",
    },
    show: {
      fr: "Afficher",
      en: "Show",
    },
    position: {
      fr: "Position",
      en: "Position",
    },
    editable_for: {
      fr: "Modifiable pendant encore",
      en: "Editable for",
    },
    minutes: {
      fr: "Minutes",
      en: "Minutes",
    },
    show_password: {
      fr: "Afficher le mot de passe",
      en: "Show password",
    },
    send: {
      fr: "Envoyer",
      en: "Send",
    },
    password: {
      fr: "Mot de passe",
      en: "Password",
    },
    close_the_window: {
      fr: "Annul",
    },
    caption: {
      fr: "Légende",
      en: "Caption",
    },
    description: {
      fr: "Description",
      en: "Description",
    },
    collections: {
      fr: "Collections",
      en: "Collections",
    },
    part_of_collections: {
      fr: "Dans les collections",
      en: "Part of collections",
    },
    collection: {
      fr: "Collection",
      en: "Collection",
    },
    fragments_in_collection: {
      fr: "Récits dans la collection",
      en: "Stories in fragment",
    },
    add_remove_fragments: {
      fr: "Ajouter ou retirer des récits existants",
      en: "Add or remove stories from this list",
    },
    create_add_remove_fragments: {
      fr: "Créer de nouveaux récits, et ajouter ou retirer des récits existants à la collection.",
      en: "Create new stories, and add or remove existing stories from the collection.",
    },
    fragments_not_in_collection: {
      fr: "Tous les récits",
      en: "All stories",
    },
    all_corpus: {
      fr: "Tous les corpus (admin)",
      en: "All corpus (admin)",
    },
    source: {
      fr: "Lien",
      en: "link",
    },
    open: {
      fr: "Ouvrir",
      en: "Open",
    },
    go_to_website: {
      fr: "Accéder au site",
      en: "Go to website",
    },
    sure_to_remove_corpus: {
      fr: "Voulez-vous vraiment supprimer ce corpus ?",
      en: "Do you really want to remove this corpus?",
    },
    sure_to_remove_fragment: {
      fr: "Voulez-vous vraiment supprimer ce récit ?",
      en: "Do you really want to remove this story?",
    },
    sure_to_remove_fragment_from_coll: {
      fr: "Voulez-vous vraiment retirer ce récit de cette collection ?",
      en: "Do you really want to remove this story from this collection?",
    },
    fragments_in_collection: {
      fr: "Récits appartenants à cette collection",
      en: "Stories in this collection",
    },
    rename_tag: {
      fr: "Renommer l’onglet",
      en: "Rename tag",
    },
    rename: {
      fr: "Renommer",
      en: "Rename",
    },
    current_tag_name: {
      fr: "Nom actuel",
      en: "Current name",
    },
    new_tag_name: {
      fr: "Nouveau nom",
      en: "New name",
    },
    sure_to_remove_media: {
      fr: "Voulez-vous vraiment supprimer ce média ?",
      en: "Do you really want to remove this media?",
    },
    sure_to_remove_collection: {
      fr: "Voulez-vous vraiment supprimer cette collection ?",
      en: "Do you really want to remove this collection?",
    },
    all: {
      fr: "Afficher tous les récits",
      en: "Show all stories",
    },

    online: {
      fr: "En ligne",
      en: "Online",
    },
    remove: {
      fr: "Supprimer",
      en: "Remove",
    },
    cancel: {
      fr: "Annuler",
      en: "Cancel",
    },
    yes: {
      fr: "Oui",
      en: "Yes",
    },
    no: {
      fr: "Non",
      en: "No",
    },
    none: {
      fr: "Aucun",
      en: "None",
    },
    moveup: {
      fr: "Remonter",
      en: "Move up",
    },
    movedown: {
      fr: "Descendre",
      en: "Move down",
    },
    import_medias: {
      fr: "Importer des fichiers",
      en: "Import files",
    },
    sent: {
      fr: "Envoyé",
      en: "Sent",
    },
    comment: {
      fr: "Commentaire",
      en: "Comment",
    },
    no_comment_yet: {
      fr: "À renseigner",
      en: "Empty for now",
    },

    reactions: {
      fr: "Réactions",
      en: "Reactions",
    },
    by_creation_date: {
      fr: "Trier par date de création",
      en: "Sort by date",
    },
    by_title: {
      fr: "Trier par titre",
      en: "Sort by title",
    },
    retry: {
      fr: "Réessayer",
      en: "Retry",
    },

    save: {
      fr: "Enregistrer",
      en: "Save",
    },
    about: {
      fr: "à propos",
      en: "about",
    },
    add: {
      fr: "Ajouter",
      en: "Add",
    },
    enter_password_to_connect: {
      fr: "Renseignez le mot de passe pour accéder au corpus",
      en: "Enter the password to access corpus",
    },
    create_a_corpus: {
      fr: "Créer un corpus",
      en: "Create a corpus",
    },

    create: {
      fr: "Créer",
      en: "Create",
    },
    corpus_name: {
      fr: "Nom du corpus",
      en: "Name of the corpus",
    },
    subtitle: {
      fr: "Sous-titre",
      en: "Second title",
    },
    description_source: {
      fr: "Description, source…",
      en: "Description, source…",
    },
    create_a_story: {
      fr: "Ajouter un récit",
      en: "Add a story",
    },
    stories: {
      fr: "Récits",
      en: "Stories",
    },
    add_a_story_to_coll: {
      fr: "Ajouter un récit à cette collection",
      en: "Add a story to this collection",
    },
    create_a_source: {
      fr: "Créer une source de contribution",
      en: "Create a source of contribution",
    },
    edit_a_fragment: {
      fr: "Éditer un récit",
      en: "Edit a story",
    },
    fragment_title: {
      fr: "Titre",
      en: "Title",
    },
    tabs: {
      fr: "Onglet(s)",
      en: "Tab(s)",
    },
    tags: {
      fr: "Catégories",
      en: "Categories",
    },
    keywords: {
      fr: "Mots-clés",
      en: "Keywords",
    },
    show_all_tags: {
      fr: "Afficher toutes les catégories",
      en: "Show all tags",
    },
    hide: {
      fr: "Masquer",
      en: "Hide",
    },
    show_all_keywords: {
      fr: "Afficher tous les mots-clés",
      en: "Show all keywords",
    },
    show_all_collections: {
      fr: "Afficher toutes les collections",
      en: "Show all collections",
    },
    your_search: {
      fr: "Votre recherche",
      en: "Your search",
    },
    no_with_similar_keywords: {
      fr: "Aucun récit avec des mots-clés similaires",
      en: "No stories with similar keywords",
    },
    with_similar_keywords: {
      fr: "récits avec des mots-clés similaires",
      en: "stories with similar keywords",
    },
    other_fragments: {
      fr: "autres récits",
      en: "other stories",
    },
    remove_image: {
      fr: "Retirer l’image",
      en: "Remove image",
    },
    remove_from_coll: {
      fr: "Retirer",
      en: "Remove",
    },
    add_keyword: {
      fr: "Ajouter un mot-clé",
      en: "Add a keyword",
    },
    add_tab: {
      fr: "Rattacher à une catégorie",
      en: "Link to a tag",
    },
    suggestion: {
      fr: "Suggestion",
      en: "Suggestion",
    },
    existing: {
      fr: "Déjà créés",
      en: "Already created",
    },
    alreay_read: {
      fr: "Déjà ouvert",
      en: "Already opened",
    },
    tag_already_exists: {
      fr: "Ce mot-clé existe déjà",
      en: "This tag already exists",
    },
    cover_image: {
      fr: "Logos",
      en: "Logos",
    },
    download: {
      fr: "Télécharger",
      en: "Download",
    },
    embed_instructions: {
      fr: "Placez ici l’URL vers une vidéo Vimeo, Youtube, Twitter ou SoundCloud",
      en: "Add a URL to Vimeo, Youtube, Twitter or SoundCloud",
    },
    link_instructions: {
      fr: "Renseignez une URL type <u>https://www.plurality-university.org/</u>",
      en: "Paste a link to a URL such as <u>https://www.plurality-university.org/</u>",
    },
    full_url: {
      fr: "URL complète",
      en: "Full URL",
    },
    embed_instructions_vimeo: {
      fr: "Format attendu : https://vimeo.com/399094491",
      en: "Expected format: https://vimeo.com/399094491",
    },
    embed_instructions_youtube: {
      fr: "Format attendu : https://www.youtube.com/watch?v=8yj9X2YHTP4",
      en: "Expected format: https://www.youtube.com/watch?v=8yj9X2YHTP4",
    },
    embed_instructions_souncloud: {
      fr: "Format attendu : https://soundcloud.com/the-bugle/bugle-179-playas-gon-play",
      en: "Expected format: https://soundcloud.com/the-bugle/bugle-179-playas-gon-play",
    },
    embed_instructions_twitter: {
      fr: "Format attendu : https://twitter.com/PluralityU/status/1349280309116891138",
      en: "Expected format: https://twitter.com/PluralityU/status/1349280309116891138",
    },

    drop_files_here: {
      fr: "Déposez vos fichier(s) ici",
      en: "Drop file(s) here",
    },
    files: {
      fr: "Fichier(s)",
      en: "File(s)",
    },
    text: {
      fr: "Texte",
      en: "Text",
    },
    moment_already_exists: {
      fr: "Cette source a déjà été créé",
      en: "This source has already been created",
    },
    remember_settings: {
      fr: "Ne plus afficher cette fenêtre",
      en: "Do not show this windows again",
    },
    changes_not_saved_sureToCloseModal: {
      fr: "Des modifications ont eu lieu, souhaitez-vous les enregistrer ?",
      en: "All changes were not saved. Do you really want to close this window?",
      nl: "Er zijn wijzigingen gebeurd , wilt u deze opslaan?",
      oc: "De modificacions se faguèron, desiratz de las enregistrar ?",
      de: "Änderungen wurden vorgenommen, wollen Sie sie speichern?",
    },
    close_the_window: {
      fr: "Non, fermer sans enregistrer",
      en: "No, close without saving",
      nl: "Nee, sluiten zonder opslaan",
      oc: "Non, clavar sens enregistrar",
      de: "Nein, schliessen Sie ohne zu speichern",
    },

    save_changes: {
      fr: "Oui, enregistrer les modifications",
      en: "Yes, save changes",
      nl: "Ja, wijzigingen opslaan. ",
      oc: "Òc, enregistrar las modificacions",
      de: "Ja, Änderungen speichern",
    },
    password_required_to_edit: {
      fr: "Mot de passe requis pour contribuer",
      en: "Password required to contribute",
    },
    remember_password_on_this_device: {
      fr: "Sauvegarder pour cet appareil",
      en: "Remember for this device",
    },
    no_preview_available: {
      fr: "Aucun aperçu disponible pour ce site",
      en: "No preview available for this website",
    },
    failed_to_save_media: {
      fr: "Les modifications n’ont pas pu être enregistrées",
      en: "Failed to save changes",
    },
    adding_password_warning: {
      fr: "Attention ! Si vous ajoutez ou modifiez un mot de passe tous les utilisateurs qui y sont actuellement connectés devront le renseigner avant de pouvoir continuer à contribuer.",
      en: "Warning! Adding or changing the password will disconnect all users until they enter the new password.",
      nl: "Opgelet! Als u een wachtwoord toevoegt of wijzigt, moeten alle gebruikers die er momenteel mee verbonden zijn dit invoeren voordat ze een bijdrage kunnen blijven leveren..",
      oc: "Avisa ! Si volètz apondre o modificar un mot de Santa-Clara totes los utilizaires que i son ara conectats deuràn l'entresenhar abans que de poder continuar.",
      de: "Achtung! Wenn Sie en Passwort hinzufügen oder ändern, müssen Sie alle derzeit eingeloggten Benutzer informieren, damit diese das neue Passwort eingeben.",
    },
    removing_password_warning: {
      fr: "Si vous retirez le mot de passe tous les utilisateurs qui ont accès à do•doc pourront modifier le projet.",
      en: "Removing the password for this project will allow everyone to access, edit and delete it.",
      nl: "Als u het wachtwoord verwijdert, kunnen alle gebruikers die toegang hebben tot do•doc het project wijzigen.",
      oc: "Si tiratz lo mot de Santa-Clara totes los utilizaires qu'an accès a do•doc poiràn modificar lo projècte.",
      de: "Wenn Sie das Passwort entfernen, können alle Benutzer, die Zugriff auf do•doc haben, das Projekt bearbeiten bzw. löschen.",
    },
    scroll_to_top: {
      fr: "Remonter",
      en: "Scroll to top",
    },
  };

  return messages;
})();
