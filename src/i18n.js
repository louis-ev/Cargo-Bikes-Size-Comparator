import { createI18n } from 'vue-i18n'

let locale = 'en'
if (localStorage.getItem('i18n.locale')) locale = localStorage.getItem('i18n.locale')
else if (navigator.language && navigator.language.includes('fr')) locale = 'fr'

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
        no_cookies_no_tracking_no_ads_and_fully_rgpd_compliant:
          'No cookies, no tracking, no ads, and fully RGPD-compliant. Website hosted in France.',
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
        collaborative_bike_database: 'You can see the collaborative bike database',
        here: 'here',
        if_you_have_questions: 'If you have any questions, send me an email at',
        step_1_basic_informations: 'Step 1: basic informations',
        step_2_profile_image_and_size: 'Step 2: profile image and size',
        step_3_share_this_information: 'Step 3: share this information',
        back: 'back',
        next: 'next',
        send: 'send',
        add_another_bike: 'add another bike',
        close: 'close',
        bike_mostly_made_in: 'Bike mostly made in',
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
        failed_to_load_image: 'Failed to load image',
        this_may_be_because:
          'This may be because the <b>URL to image</b> is not a valid image or the source server does not allow loading on another website.',
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
        the_following_code_contains_all_the_informations: `The following code contains all the informations about this bike.`,
        copy_to_clipboard: `Copy to clipboard`,
        or_copy_post: `Or copy this information and post it in a comment and tag me: <a href="https://piaille.fr/@louis_ev" target="_blank">@louis_ev on Mastodon</a>,
        <a href="https://x.com/timetofirstfix" target="_blank">@timetofirstfix on Twitter/X</a>, or <a href="https://www.reddit.com/user/luddits/" target="_blank">@luddits on Reddit</a>
`,
        on: 'on',
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
        no_cookies_no_tracking_no_ads_and_fully_rgpd_compliant:
          "Pas de cookies, pas de traceurs, pas d'annonces et compliant RGPD. Site web hébergé en France.",
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
      }
    }
  }
})

export default i18n
