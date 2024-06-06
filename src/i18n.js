import { createI18n } from 'vue-i18n'

let locale = 'en'
if (localStorage.getItem('i18n.locale')) locale = localStorage.getItem('i18n.locale')
else if (navigator.language && navigator.language.includes('fr')) locale = 'fr'
document.documentElement.lang = locale

const i18n = createI18n({
  locale: locale,
  fallbackLocale: 'en',
  messages: {
    en: {
      message: {
        title: 'Cargo Bikes Size Comparator',
        search_placeholder: 'Search by model or manufacturer',
        no_bikes_matched_your_search: 'No bikes matched your search.',
        to_contribute_a_bike: 'To contribute a bike,',
        read_the_guide: 'read the guide',
        or_ask_me: 'or ask me',
        click_on_bikes_in_this_list_to_compare_their_size: 'Click on bikes to compare their size',
        bike_selected: 'bike selected',
        bikes_selected: 'bikes selected',
        reset: 'Reset',
        missing_length_information: 'Missing length information',
        website: 'website',
        advanced_options: 'Advanced options',
        grid_step: 'Grid step',
        zoom: 'Zoom',
        created_by: 'Created by',
        in_Nantes: 'in Nantes, France, with contributions from around the world.',
        report_errors_and_bugs: 'Report errors and bugs / send feedbacks / contribute bikes',
        on_Github: 'on Github',
        or: 'or',
        via_email: 'via email',
        no_tracking_cookies_no_ads_and_fully_rgpd_compliant:
          'No tracking cookies, no ads, fully RGPD-compliant. Website hosted in France.',
        specific_measures_taken_from: 'Specific measures taken from',
        this_document: 'this document',
        source_code: 'Source code',
        available_on_Github: 'available on Github',
        code_design_foss: 'Code / Design / free Open Source under',
        bike_images_from_the_manufacturer_s_website: "bike images from the manufacturer's website.",
        outline_view: 'Outline View',
        bike_mostly_manufactured_and_assembled: 'Bike mostly manufactured and assembled',
        in_germany: 'in Germany',
        in_france: 'in France',
        in_united_states: 'in the United States',
        in_united_kingdom: 'in the United Kingdom',
        add_a_bike: 'Add a bike',
        left: 'Left',
        right: 'Right',
        bottom: 'Bottom'
      },
      add_bike: {
        title: 'Add a bike',
        how_to_add: 'How to add a bike to this tool',
        simple_steps: 'There are 3 simple steps and it should take you between 2 and 5 minutes.',
        data_license:
          'The data you will provide will be added to the database with the same free and open-source license (AGPL v3) as the rest of the tool.',
        collaborative_bike_database_if_you_have_questions: `You can see the collaborative bike database <a href='https://github.com/louis-ev/Cargo-Bikes-Size-Comparator/blob/main/src/assets/bike_images.json' target='_blank'>here</a>. 
          And if you have any questions, send me an email at <a href='mailto:hello{'@'}louiseveillard.com'>hello{'@'}louiseveillard.com</a>.`,
        step_1_basic_informations: 'Step 1: basic informations',
        step_2_profile_image_and_size: 'Step 2: profile image and size',
        step_3_share_this_information: 'Step 3: share this information',
        back: 'back',
        next: 'next',
        send: 'send',
        add_another_bike: 'add another bike',
        close: 'close',
        model: 'Model',
        manufacturer: 'Manufacturer',
        total_bike_length: 'Total bike length',
        usually_available_on_the_manufacturer_s_website:
          "Usually available on the manufacturer's website",
        cm: 'cm',
        inches: 'inches',
        product_page_url: 'Official product page URL',

        if_that_information_is_officially_available:
          'If that information is officially available, the name of the country the bike and its frame is made in (and not just assembled). Optional.',
        send_me_an_email: 'Send me an email',
        with_this_information:
          "with this information and I'll do it for you and let you know when it's done.",
        suggestions: 'Suggestions',
        if_you_know_a_bit_of_javascript_add_it_yourself:
          'If you know a bit of JavaScript, add it yourself:',
        fork_the_repository: 'Fork the repository {link} on Github',
        on_github: 'on GitHub',
        if_the_image_includes_a_white_background:
          'If the image includes a white background, remove it with a software such as GIMP, https://new.express.adobe.com/ or https://www.experte.com/background-remover and save it as a PNG with the highest possible resolution,',
        loading: 'Loading',
        failed_to_load_image: 'Failed to load image in field <b>Bike image</b>',
        this_may_be_because:
          'This may be because the link is not a valid image or the source server does not allow loading on another website.',
        you_can_click_back:
          'You can click back to correct the URL and try again, or download the image from the URL yourself and upload it here manually.',
        use_these_controls: `Use these controls to indicate the bike's size and position in the overall image.
          <strong>Left and right sliders should match the bike length value</strong> (ie. if the
          manufacturer indicates bike length starting from the back of the rear rack to the front
          wheel, or from the back of the rear wheel to the front wheel, etc.).`,
        align_with_the_left_edge: `Align with the left edge (back of the rear wheel or the rack), depending on what the
          <i>Total bike length</i> refers to.`,
        align_with_the_right_edge: `Align with the right edge (front of the front wheel or front rack), depending on what
        the <i>Total bike length</i> refers to.`,
        align_with_the_ground: `Align with the ground, typically the contact point between the wheels and the floor.`,
        to_add_this_bike_to_the_database: `Add this bike to the comparator database.`,
        the_following_code_contains_all_the_informations: `The following code contains all the informations you’ve provided.`,
        by_mail: `by email, click on the following address and validate the sending of a generated email containing the code above -> `,
        or: 'or,',
        copy_this_code_to_clipboard: `Click to copy this code to the clipboard`,
        or_copy_post: `then post this information on social media platforms and tag me: <a href="https://piaille.fr/{'@'}louis_ev" target="_blank">{'@'}louis_ev on Mastodon</a>,
        <a href="https://x.com/timetofirstfix" target="_blank">{'@'}timetofirstfix on Twitter/X</a>, or <a href="https://www.reddit.com/user/luddits/" target="_blank">{'@'}luddits on Reddit</a>
`,
        on: 'on',
        thank_you: 'Thank you!',
        a_bike_with_this_model_manufacturer_is_already_in_the_database:
          'A bike with this name and manufacturer is already in the database.',
        or_if_you_know_a_bit_of_javascript_add_it_yourself: `Or if you know a bit of JavaScript, add it yourself:`,
        add_the_bike_informations_to_the:
          'Add the bike informations to the {link} file and submit a pull request.',
        bike_image: 'Bike image',
        bike_image_explanation:
          'It must be a profile image of the bike, with the front to the right, ideally on a white or transparent background. Higher resolution is better (at least 1000px in each dimension).'
      }
    },
    fr: {
      message: {
        title: 'Comparateur de taille de vélos cargo',
        search_placeholder: 'Rechercher par modèle ou fabricant',
        no_bikes_matched_your_search: 'Aucun vélo ne correspond à votre recherche.',
        to_contribute_a_bike: 'Pour ajouter un vélo,',
        read_the_guide: 'lire la documentation',
        or_ask_me: 'ou me demander',
        via_email: 'via email',
        click_on_bikes_in_this_list_to_compare_their_size:
          'Cliquez sur les vélos pour  comparer leur taille',
        bike_selected: 'vélo sélectionné',
        bikes_selected: 'vélos sélectionnés',
        reset: 'Réinitialiser',
        missing_length_information: 'Information de longueur manquante',
        website: 'site web',
        advanced_options: 'Options avancées',
        grid_step: 'Pas de la grille',
        zoom: 'Zoom',
        created_by: 'Créé par',
        in_Nantes: 'à Nantes, en France, avec des contributions du monde entier.',
        report_errors_and_bugs: "N'hésitez pas à m'indiquez les erreurs, retours et bugs ",
        on_Github: 'sur Github.',
        or: 'ou',
        no_tracking_cookies_no_ads_and_fully_rgpd_compliant:
          'Pas de cookies traceurs, pas de publicité et respecte le RGPD. Site web hébergé en France.',
        specific_measures_taken_from: 'Mesures avancées prises dans',
        this_document: 'ce document',
        source_code: 'Code source',
        available_on_Github: 'disponible sur Github',
        code_design_foss: 'Code / Design is free Open Source under',
        bike_images_from_the_manufacturer_s_website: "bike images from the manufacturer's website.",
        outline_view: 'Vue contour',
        bike_mostly_manufactured_and_assembled: 'Vélo principalement fabriqué et assemblé',
        in_germany: 'en Allemagne',
        in_france: 'en France',
        in_united_states: 'aux États-Unis',
        in_united_kingdom: 'au Royaume-Uni',
        add_a_bike: 'Ajouter un vélo',
        left: 'Gauche',
        right: 'Droite',
        bottom: 'Bas'
      },
      add_bike: {
        title: 'Ajouter un vélo',
        how_to_add: 'Comment ajouter un vélo à cet outil ?',
        simple_steps: 'Il y a 3 étapes simples et cela devrait vous prendre entre 2 et 5 minutes.',
        data_license:
          'Les données que vous fournirez seront ajoutées à la base de données avec la même licence libre et open-source (AGPL v3) que le reste de l’outil.',
        collaborative_bike_database_if_you_have_questions: `Vous pouvez voir la base de données collaborative <a href='https://github.com/louis-ev/Cargo-Bikes-Size-Comparator/blob/main/src/assets/bike_images.json' target='_blank'>ici</a>. Si vous avez des questions, envoyez-moi un email à <a href='mailto:hello{'@'}louiseveillard.com'>hello{'@'}louiseveillard.com</a>.`,
        step_1_basic_informations: 'Étape 1: informations de base',
        step_2_profile_image_and_size: 'Étape 2: image de profil et taille',
        step_3_share_this_information: 'Étape 3: envoyer ces informations',
        back: 'retour',
        next: 'suivant',
        send: 'envoyer',
        add_another_bike: 'ajouter un autre vélo',
        close: 'fermer',
        model: 'Modèle',
        manufacturer: 'Fabricant',
        total_bike_length: 'Longueur du vélo',
        usually_available_on_the_manufacturer_s_website:
          'Généralement disponible sur le site web du fabricant',
        cm: 'cm',
        inches: 'pouces',
        product_page_url: 'URL de la page produit officielle',

        if_that_information_is_officially_available:
          'Si cette information est officiellement disponible, le nom du pays où le vélo et son cadre sont fabriqués (et non assemblés). Optionnel.',
        send_me_an_email: 'Envoyer un email à',
        with_this_information:
          'avec ces informations et je vous indiquerai quand elles auront été ajoutées.',
        suggestions: 'Suggestions',
        if_you_know_a_bit_of_javascript_add_it_yourself:
          'Si vous connaissez un peu JavaScript, ajoutez-en vous-même :',
        fork_the_repository: 'Forkez le dépôt {link} sur Github',
        if_the_image_includes_a_white_background:
          'Si l’image inclut un fond blanc, supprimez le avec un logiciel comme GIMP, https://new.express.adobe.com/ ou https://www.experte.com/background-remover et enregistrez-la sous format PNG avec la meilleure résolution possible,',
        loading: 'Chargement',
        failed_to_load_image: 'Échec de chargement de l’image du champ <b>Image du vélo</b>',
        this_may_be_because:
          'L’url ne renvoie peut-être pas vers une image valide, ou le serveur source ne permet pas d’afficher l’image sur un autre site.',
        you_can_click_back:
          "Vous pouvez retourner en arrière et modifier l'URL, ou télécharger l'image depuis l'URL et l'envoyer manuellement ici.",
        use_these_controls: `Utilisez ces contrôles pour indiquer la taille et la position du vélo dans l'ensemble de l'image.
          <strong>Les curseurs de gauche et de droite doivent correspondrent à la valeur de la longueur du vélo</strong> (par exemple si le fabricant indique la longueur du vélo à partir de l’arrière du porte-bagage ou l’arrière de la roue arrière, etc.).`,
        align_with_the_left_edge: `Alignez avec l’arrière de la roue arrière ou du porte-bagage, selon ce à quoi fait référence la <i>longueur totale</i> indiqué à l’étape précédente.`,
        align_with_the_right_edge: `Alignez avec l’avant de la roue ou du porte-bagage avant, selon ce à quoi fait référence la <i>longueur totale</i> indiqué à l’étape précédente.`,
        align_with_the_ground: `Alignez avec la ligne du sol, généralement le point de contact entre les roues et le sol.`,
        to_add_this_bike_to_the_database: `Ajouter ce vélo à la base de données du comparateur.`,
        the_following_code_contains_all_the_informations: `Le code ci-dessous contient toutes les informations que vous avez fournies.`,
        by_mail: `par mail, en cliquant sur l'adresse ci-dessous, vous n'aurez plus qu'à valider l'envoi
        d'un mail généré contenant le code ci-dessus -> `,
        or_copy_post: `et poster le code dans un commentaire en me mentionnant : <a href="https://piaille.fr/{'@'}louis_ev" target="_blank">{'@'}louis_ev sur Mastodon</a>,
        <a href="https://x.com/timetofirstfix" target="_blank">{'@'}timetofirstfix sur Twitter/X</a>, ou <a href="https://www.reddit.com/user/luddits/" target="_blank">{'@'}luddits sur Reddit</a>
`,
        or: 'ou alors ',
        copy_this_code_to_clipboard: `cliquer pour copier vers le presse-papier`,

        a_bike_with_this_model_manufacturer_is_already_in_the_database: `Un vélo de ce modèle et par ce fabricant est déjà dans la base de données.`,
        on: 'sur',
        or_if_you_know_a_bit_of_javascript_add_it_yourself: `enfin, si vous connaissez un peu de JavaScript, vous pouvez aussi l’ajouter vous-même :`,
        add_the_bike_informations_to_the:
          'Ajoutez les informations du vélo dans le fichier {link} et soumettez une pull request.',
        bike_image: 'Image du vélo',
        thank_you: 'Merci !',
        bike_image_explanation:
          'Ce doit être une image de profil du vélo, tourné vers la droite, idéalement sur un fond blanc ou transparent. Une meilleure résolution est préférable (au moins 1000px dans chaque dimension).'
      }
    }
  }
})

export default i18n
