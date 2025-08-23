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

        or_click_on_bikes: 'or click on one of these {count} bikes:',
        click_on_bikes_in_this_list_to_compare_their_size:
          'Click on one of these {count} bikes to compare their size:',
        bikes_selected: '{count} bike selected | {count} bikes selected',
        bikes_not_selected: '{count} bike to compare | {count} bikes to compare',
        unselect: 'Unselect this bike',
        reset: 'Reset',
        position: 'Position',
        adjust: 'Adjust',
        opacity: 'Opacity',
        rotation: 'Rotation',
        in_situ: 'In Situ',
        missing_length_information: 'Missing length information',
        current_adjustments: 'Current adjustments',
        advanced_options: 'Advanced options',
        grid_step: 'Grid step',
        zoom: 'Zoom',
        next: 'Next',
        prev: 'Previous',
        open_product_page: 'Open product page',
        request_test_url: 'Test the bike',
        created_by: 'Created by',
        in_Nantes: 'in Nantes, France, with contributions from around the world.',
        report_errors_and_bugs: 'Get in touch, report errors and bugs, send feedbacks ',
        on_Github: 'on Github',
        or: 'or',
        picture_from: 'Picture sent by',
        via_email: 'via email',
        no_tracking_cookies_no_ads_and_fully_rgpd_compliant:
          'No tracking cookies, no ads, fully RGPD-compliant. Website hosted in France.',
        specific_measures_taken_from: 'Some specific measures taken from',
        this_document: 'this document',
        source_code: 'Source code',
        available_on_Github: 'available on Github',
        code_design_foss: 'Code / Design / free Open Source under',
        bike_images_from_the_manufacturer_s_website: "bike images from the manufacturer's website.",
        outline_view: 'Outline',
        bike_frame_made_in: 'Bike frame made',
        bike_assembled_in: 'Assembled',
        in_germany: 'in Germany',
        in_austria: 'in Austria',
        in_hungary: 'in Hungary',
        in_denmark: 'in Denmark',
        in_portugal: 'in Portugal',
        in_turkey: 'in Turkey',
        in_france: 'in France',
        in_italy: 'in Italy',
        in_belgium: 'in Belgium',
        in_china: 'in China',
        in_poland: 'in Poland',
        in_usa: 'in the United States',
        in_taiwan: 'in Taiwan',
        in_europe: 'in Europe',
        in_netherlands: 'in the Netherlands',
        in_uk: 'in the United Kingdom',
        in_sweden: 'in Sweden',
        in_australia: 'in Australia',
        add_a_bike: 'Add a bike',
        cant_find_a_bike: 'Can’t find what you’re looking for?',
        left: 'Left',
        right: 'Right',
        top: 'Top',
        bottom: 'Bottom',
        width: 'Width',
        height: 'Height',
        download_comparison: 'Download comparison',
        show_human_silhouette: 'Show human silhouette',
        show_regular_bike_silhouette: 'Reference bike',
        close: 'close',
        measure: 'Measure',
        technical_infos: 'Technical infos',
        compare_bikes: 'Compare {count} bike | Compare {count} bikes'
      },
      bike_types: {
        by_category: 'By category:',
        longtail: 'Longtail',
        midtail: 'Midtail',
        lowtail: 'Lowtail',
        foldable: 'Foldable',
        longjohn: 'Longjohn',
        shortjohn: 'Shortjohn',
        tricycle: 'Tricycle',
        longdiamond: 'Longdiamond',
        other: 'Other'
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
        fill_as_many_fields_as_possible:
          'Fill in the following fields with the informations you can find. All fields are optional.',
        back: 'back',
        next: 'next',
        send: 'send',
        add_another_bike: 'add another bike',
        image_source: 'Indicate the profile image of the bike you want to add',
        add_by_url: 'Paste the URL to the image of the bike online',
        couldnt_find_the_image_you_want:
          "I couldn't find an image that matches what you want / I don't know which image to take",
        url: 'URL',
        load_image: 'Load image',
        add_by_file: 'Import image file from your device',
        model: 'Model',
        manufacturer: 'Manufacturer',
        bike_type: 'Bike type',
        total_bike_length: 'Total bike length',
        usually_available_on_the_manufacturer_s_website:
          "Usually available on the manufacturer's website",
        cm: 'cm',
        inches: 'inches',
        weight: 'Weight',
        in_kilograms: 'in kilograms',
        product_page_url: 'Official product page URL',
        bike_frame_country: 'Country where the bike frame is made (and not just assembled).',
        bike_assembled_in: 'Country where the bike is assembled',

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
        the_following_code_contains_all_the_informations: `The following code contains all the informations you've provided.`,
        by_mail: `by email, click on the following address and validate the sending of a generated email containing the code above (and add the image as an attachment if it's stored on your computer) -> `,
        or: 'or,',
        copy_this_code_to_clipboard: `Click to copy this code to the clipboard`,
        or_copy_post: `then post this information on social media platforms and tag me: <a href="https://piaille.fr/{'@'}louis_ev" target="_blank">{'@'}louis_ev on Mastodon</a> or <a href="https://www.reddit.com/user/luddits/" target="_blank">{'@'}luddits on Reddit</a>
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
          'It must be a profile image of the bike, with the front to the right, ideally on a white or transparent background. Higher resolution is better (at least 1000px in each dimension).',
        show_all_manufacturers: 'Show all suggestions'
      }
    },
    fr: {
      message: {
        title: 'Comparateur de taille de vélos cargo',
        search_placeholder: 'Recherchez par modèle ou fabricant',
        no_bikes_matched_your_search: 'Aucun vélo ne correspond à votre recherche.',
        to_contribute_a_bike: 'Pour ajouter un vélo,',
        read_the_guide: 'lire la documentation',
        or_ask_me: 'ou me demander',
        via_email: 'via email',
        picture_from: 'Image envoyée par',
        or_click_on_bikes: 'ou cliquez sur un de ces {count} vélos :',
        click_on_bikes_in_this_list_to_compare_their_size:
          'Cliquez sur un de ces {count} vélos pour comparer leur taille :',
        bikes_selected: '{count} vélo sélectionné | {count} vélos sélectionnés',
        bikes_not_selected: '{count} vélo disponible | {count} vélos disponibles',
        unselect: 'Déselectionner ce vélo',
        reset: 'Réinitialiser',
        position: 'Position',
        adjust: 'Ajuster',
        opacity: 'Opacité',
        rotation: 'Rotation',
        in_situ: 'In Situ',
        missing_length_information: 'Information de longueur manquante',
        current_adjustments: 'Ajustements actuels',
        advanced_options: 'Options avancées',
        grid_step: 'Pas de la grille',
        zoom: 'Zoom',
        next: 'Suivant',
        prev: 'Précedent',
        open_product_page: 'Ouvrir la page du vélo',
        request_test_url: 'Tester le vélo',
        created_by: 'Créé par',
        in_Nantes: 'à Nantes, en France, avec des contributions du monde entier.',
        report_errors_and_bugs: "N'hésitez pas à m'indiquez les erreurs, retours et bugs ",
        on_Github: 'sur Github.',
        or: 'ou',
        no_tracking_cookies_no_ads_and_fully_rgpd_compliant:
          'Pas de cookies traceurs, pas de publicité et respecte le RGPD. Site web hébergé en France.',
        specific_measures_taken_from: 'Certaines mesures proviennent de',
        this_document: 'ce document',
        source_code: 'Code source',
        available_on_Github: 'disponible sur Github',
        code_design_foss: 'Code / Design libre et open-source sous licence',
        bike_images_from_the_manufacturer_s_website:
          'image des vélos provenant des sites des fabricants.',
        outline_view: 'Contours',
        bike_frame_made_in: 'Cadre du vélo fabriqué',
        bike_assembled_in: 'Assemblé',
        in_germany: 'en Allemagne',
        in_austria: 'en Autriche',
        in_hungary: 'en Hongrie',
        in_denmark: 'au Danemark',
        in_portugal: 'au Portugal',
        in_turkey: 'en Turquie',
        in_france: 'en France',
        in_italy: 'en Italie',
        in_belgium: 'en Belgique',
        in_china: 'en Chine',
        in_poland: 'en Pologne',
        in_usa: 'aux États-Unis',
        in_taiwan: 'à Taïwan',
        in_europe: 'en Europe',
        in_netherlands: 'aux Pays-Bas',
        in_uk: 'au Royaume-Uni',
        in_sweden: 'en Suède',
        in_australia: 'en Australie',
        add_a_bike: 'Ajouter un vélo',
        cant_find_a_bike: 'Vous ne trouvez pas ce que vous cherchez ?',
        left: 'Gauche',
        right: 'Droite',
        top: 'Haut',
        bottom: 'Bas',
        width: 'Largeur',
        height: 'Hauteur',
        download_comparison: 'Télécharger la comparaison',
        show_human_silhouette: 'Afficher une silhouette humaine',
        show_regular_bike_silhouette: 'Vélo classique',
        close: 'fermer',
        measure: 'Mesurer',
        technical_infos: 'Informations techniques',
        compare_bikes: 'Comparer {count} vélo | Comparer {count} vélos'
      },
      bike_types: {
        by_category: 'Par catégorie&nbsp;:',
        longtail: 'Longtail',
        midtail: 'Midtail',
        lowtail: 'Lowtail',
        foldable: 'Pliant',
        longjohn: 'Biporteur',
        shortjohn: 'Biporteur court',
        tricycle: 'Tricycle',
        longdiamond: 'Longdiamond',
        other: 'Autre'
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
        fill_as_many_fields_as_possible:
          'Renseignez les champs suivants avec les informations que vous connaissez ou que vous pouvez trouver en ligne.',
        back: 'retour',
        next: 'suivant',
        send: 'envoyer',
        add_another_bike: 'ajouter un autre vélo',
        image_source: 'Indiquer l’image de profil du vélo que vous souhaitez ajouter',
        add_by_url: 'Coller l’URL vers l’image du vélo en ligne',
        couldnt_find_the_image_you_want:
          'Je n’ai pas trouvé d’image adaptée / je ne sais pas quelle image prendre',
        url: 'URL',
        add_by_file: 'Importer l’image depuis votre appareil',
        model: 'Modèle',
        manufacturer: 'Fabricant',
        bike_type: 'Type de vélo',
        total_bike_length: 'Longueur du vélo',
        usually_available_on_the_manufacturer_s_website:
          'Généralement disponible sur le site web du fabricant',
        cm: 'cm',
        inches: 'pouces',
        weight: 'Poids',
        in_kilograms: 'en kilogrammes',
        product_page_url: 'URL de la page produit officielle',
        bike_frame_country: 'Pays où le cadre du vélo est fabriqué',
        bike_assembled_in: 'Pays où le vélo est assemblé',

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
        d'un mail généré contenant le code ci-dessus (et ajoutez l’image en pièce jointe si elle est stockée sur votre ordinateur) -> `,
        or_copy_post: `et poster le code dans un commentaire en me mentionnant : <a href="https://piaille.fr/{'@'}louis_ev" target="_blank">{'@'}louis_ev sur Mastodon</a> ou <a href="https://www.reddit.com/user/luddits/" target="_blank">{'@'}luddits sur Reddit</a>
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
          'Ce doit être une image de profil du vélo, tourné vers la droite, idéalement sur un fond blanc ou transparent. Une meilleure résolution est préférable (au moins 1000px dans chaque dimension).',
        show_all_manufacturers: 'Afficher toutes les suggestions'
      }
    }
  }
})

export default i18n
