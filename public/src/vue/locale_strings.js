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
    search_in_fragments: {
      fr: "Chercher dans les récits",
      en: "Search in stories",
    },
    back_to_fragments: {
      fr: "Retour aux récits",
      en: "Back to stories",
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
    created_on: {
      fr: "Créé le",
      en: "Created on",
    },
    close: {
      fr: "Fermer",
      en: "Close",
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
      fr: "Create new stories, and add or remove existing stories from the collection.",
    },
    fragments_not_in_collection: {
      fr: "Tous les récits",
      en: "All stories",
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
    moveup: {
      fr: "Déplacer ↑",
      en: "Move up ↑",
    },
    movedown: {
      fr: "Déplacer ↓",
      en: "Move down ↓",
    },
    import_medias: {
      fr: "Importer des fichiers",
      en: "Import files",
    },
    sent: {
      fr: "Envoyé",
      en: "Sent",
    },
    reason_for_sharing: {
      fr: "Raisons du partage",
      en: "Reasons for sharing",
    },
    reactions: {
      fr: "Réactions",
      en: "Reactions",
    },
    by_creation_date: {
      fr: "Par date de création",
      en: "By creation date",
    },
    by_title: {
      fr: "Par titre",
      en: "By title",
    },
    retry: {
      fr: "Réessayer",
      en: "Retry",
    },
    save: {
      fr: "Enregistrer",
      en: "Save",
    },
    more_infos: {
      fr: "En savoir plus",
      en: "More informations",
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
    create_a_collection: {
      fr: "Créer une collection",
      en: "Create a collection",
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
    description_source: {
      fr: "Description, source…",
      en: "Description, source…",
    },
    create_a_story: {
      fr: "Ajouter un nouveau récit",
      en: "Add a new story",
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
      fr: "Catégorie(s)",
      en: "Categorie(s)",
    },
    keywords: {
      fr: "Mot(s)-clé(s)",
      en: "Keyword(s)",
    },
    filters: {
      fr: "Filtre(s)",
      en: "Filter(s)",
    },
    no_with_similar_keywords: {
      fr: "Aucuns récits avec des mots-clés similaires",
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
  };

  return messages;
})();
