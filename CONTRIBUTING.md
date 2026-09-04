# Contributing

Thanks for contributing to the [Cargo Bikes Size Comparator](https://bikes.louiseveillard.com/).

The easiest way to start is the in-app **Add a bike** button (also available at [bikes.louiseveillard.com/?addbike](https://bikes.louiseveillard.com/?addbike)): it walks you through the fields and measures image margins, then gives you a JSON snippet to send or submit.

You can also follow [issue #9](https://github.com/louis-ev/Cargo-Bikes-Size-Comparator/issues/9), or open a pull request with the files below.

Data you contribute is published under the same license as the project (**AGPL v3**).

## Bike database

| What | Where |
| --- | --- |
| Bike metadata | [`src/assets/bikes.json`](src/assets/bikes.json) |
| Profile images | [`src/assets/bikes/`](src/assets/bikes/) |
| Changelog | [`src/assets/changelog.json`](src/assets/changelog.json) |

> **Note:** the database file was previously named `bike_images.json`. Update any bookmarks or scripts that still use the old path.

### Checklist when adding a bike

1. Add a profile image under `src/assets/bikes/` and set `src` to that filename (not a remote URL).
2. Append a new object to `src/assets/bikes.json` with a short, readable `id` (e.g. `wike-electric-salamander`).
3. Add a changelog entry at the top of `src/assets/changelog.json`.
4. If `frame_made_in` or `assembled_in` is set, verify the country is supported (see [Countries](#countries) below).
5. Prefer a right-facing side profile, white or transparent background, high resolution (ideally ≥ 1000px on each side).

### Image tips

- Upscale if needed: https://www.iloveimg.com/upscale-image
- Remove background: https://bg.addy.ie/ or https://new.express.adobe.com/
- Optimize with ImageOptim (or similar) when possible

### Useful fields

Typical fields in `bikes.json`:

- `id`, `manufacturer`, `model`, `bike_type`, `src`
- `bike_length_cm` (decimals OK; the UI rounds for display)
- `bike_length_percent`, `left_margin_percent`, `bottom_margin_percent` (from the in-app measure tool)
- `weight`, `url`, `wheel_size`, `frame_material`
- `frame_made_in`, `assembled_in`
- optional `folded_view` for foldable / convertible silhouettes

## Countries

When setting `frame_made_in` or `assembled_in`:

1. Prefer an existing spelling already used in `bikes.json` (`France`, `USA`, `UK`, `Taiwan`, `EU`, `Canada`, …).
2. If the country is **new**, add support in the **same** change:
   - EN + FR keys `message.in_<country_key>` in [`src/i18n.js`](src/i18n.js)
   - flag entry in `unicodeFlag` in [`src/helpers.js`](src/helpers.js)
3. Country keys are normalized by `countryKey()`: trim, lowercase, spaces → underscores  
   (e.g. `Czech Republic` → `czech_republic` → `in_czech_republic`).

## Code contributions

### Setup

```sh
npm install
npm run dev
```

Node **22.13+** or **24+** is required (see `engines` in `package.json`).

```sh
npm run build
npm run lint
```

### Notes

- Vue naming: `snake_case` for props / data / computed; `camelCase` for methods; camelCase custom events.
- French UI copy uses the typographic apostrophe `’` (U+2019), not ASCII `'`.
- Keep PRs focused; don’t mix unrelated refactors with a bike addition.

## Questions

Email [hello@louiseveillard.com](mailto:hello@louiseveillard.com) or open a GitHub issue / discussion.
