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
        outline_view: 'Outline View'
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
        outline_view: 'Vue contour'
      }
    }
  }
})

export default i18n
