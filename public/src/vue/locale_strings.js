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
    link: {
      fr: "Lien",
      en: "Link",
    },
    embed: {
      fr: "Embed",
      en: "Embed",
    },
    file_max_size: {
      fr: "Taille max. des fichiers",
      en: "Max file size",
    },
    sort_fragments_by: {
      fr: "Classer les fragments par",
      en: "Sort fragments by",
    },
    created_on: {
      fr: "Créé le",
      en: "Created on",
    },
    close: {
      fr: "Fermer",
      en: "Close",
    },
    created: {
      fr: "Créé",
      en: "Created",
    },
    edit: {
      fr: "Éditer",
      en: "Edit",
    },
    mode_and_moment_of_contribution: {
      fr: "Mode ou moment de contribution",
      en: "Mode or moment of contribution",
    },
    moments_name: {
      fr: "Nom du nouveau moment",
      en: "Name of the new moment",
    },
    name: {
      fr: "Nom",
      en: "Name",
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
    filter_by_moments_of_contribution: {
      fr: "Filtrer par moment de contribution",
      en: "Filter by moment of contribution",
    },
    display_options: {
      fr: "Options d’affichage",
      en: "Display options",
    },
    display_in_tags: {
      fr: "Ranger dans les onglets",
      en: "File in tabs",
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
    caption: {
      fr: "Légende",
      en: "Caption",
    },
    source: {
      fr: "Source",
      en: "Source",
    },
    open: {
      fr: "Ouvrir",
      en: "Open",
    },
    sure_to_remove_corpus: {
      fr: "Voulez-vous vraiment supprimer le corpus ?",
      en: "Do you really want to remove this corpus?",
    },
    all: {
      fr: "Afficher tous les fragments",
      en: "Show all fragments",
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
    moveup: {
      fr: "Déplacer ▲",
      en: "Move up ▲",
    },
    movedown: {
      fr: "Déplacer ▼",
      en: "Move down ▼",
    },
    import_medias: {
      fr: "Importer des fichiers",
      en: "Import files",
    },
    sent: {
      fr: "Envoyé",
      en: "Sent",
    },
    retry: {
      fr: "Réessayer",
      en: "Retry",
    },
    save: {
      fr: "Enregistrer",
      en: "Save",
    },
    add: {
      fr: "Ajouter",
      en: "Add",
    },
    enter_password_to_connect: {
      fr: "Mot de passe pour accéder",
      en: "Enter the password to access",
    },
    create_a_corpus: {
      fr: "Créer un corpus",
      en: "Create a corpus",
    },
    edit_corpus: {
      fr: "Éditer un corpus",
      en: "Edit a corpus",
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
    description: {
      fr: "Description",
      en: "Description",
    },
    create_a_fragment: {
      fr: "Créer un fragment",
      en: "Create a fragment",
    },
    create_a_moment: {
      fr: "Créer un moment",
      en: "Create a moment",
    },
    edit_a_fragment: {
      fr: "Éditer un fragment",
      en: "Edit a fragment",
    },
    fragment_title: {
      fr: "Titre du fragment",
      en: "Title",
    },
    tags: {
      fr: "Mots-clés",
      en: "Tags",
    },
    tabs: {
      fr: "Onglet(s)",
      en: "Tab(s)",
    },
    keywords: {
      fr: "Mot(s)-clé(s)",
      en: "Keyword(s)",
    },
    remove_image: {
      fr: "Retirer l’image",
      en: "Remove image",
    },
    add_keyword: {
      fr: "Ajouter un mot-clé",
      en: "Add a keyword",
    },
    add_tab: {
      fr: "Rattacher à un onglet",
      en: "Link to tab",
    },
    suggestion: {
      fr: "Suggestion",
      en: "Suggestion",
    },
    existing: {
      fr: "Déjà créés",
      en: "Already created",
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
      fr: "Placez ici l’URL vers une vidéo Vimeo, Youtube or Twitter",
      en: "Add a URL to Vimeo, Youtube or Twitter",
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
      fr: "Ce temps a déjà été créé",
      en: "This moment has already been created",
    },
  };

  return messages;
})();
