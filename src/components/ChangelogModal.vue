<template>
  <BasicModal size="medium" @close="$emit('close')">
    <template v-slot:header>
      <div>{{ $t('changelog.title') }}</div>
    </template>
    <template v-slot:content>
      <div class="_changelogContent">
        <p v-if="grouped_entries.length === 0" class="_empty">
          {{ $t('changelog.empty') }}
        </p>
        <section v-for="group in grouped_entries" :key="group.month_key" class="_monthGroup">
          <h3 class="_monthLabel">{{ group.month_label }}</h3>
          <ul class="_dateGroups">
            <li
              v-for="date_group in group.date_groups"
              :key="`${group.month_key}-${date_group.date}`"
              class="_dateGroup"
            >
              <time class="_entryDate" :datetime="date_group.date">{{
                formatEntryDate(date_group.date)
              }}</time>
              <ul class="_entries">
                <li
                  v-for="(entry, index) in date_group.entries"
                  :key="`${date_group.date}-${index}`"
                  class="_entry"
                >
                  <div class="_entryMeta">
                    <span class="_type" :data-type="entry.type">{{
                      $t(`changelog.type_${entry.type}`)
                    }}</span>
                  </div>
                  <strong class="_entryTitle">{{ entryTitle(entry) }}</strong>
                  <p v-if="entryBody(entry)" class="_entryBody">{{ entryBody(entry) }}</p>
                </li>
              </ul>
            </li>
          </ul>
        </section>
      </div>
    </template>
  </BasicModal>
</template>
<script>
import BasicModal from '@/components/BasicModal.vue'
import changelog_entries from '@/assets/changelog.json'

export default {
  components: {
    BasicModal
  },
  data() {
    return {
      changelog_entries
    }
  },
  computed: {
    recent_entries() {
      const cutoff = new Date()
      cutoff.setFullYear(cutoff.getFullYear() - 2)
      cutoff.setHours(0, 0, 0, 0)
      return this.changelog_entries.filter((entry) => new Date(entry.date) >= cutoff)
    },
    grouped_entries() {
      const groups = new Map()
      const locale = this.$i18n.locale === 'fr' ? 'fr-FR' : 'en-US'

      for (const entry of this.recent_entries) {
        const date = new Date(entry.date)
        const month_key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        if (!groups.has(month_key)) {
          const month_label = new Intl.DateTimeFormat(locale, {
            month: 'long',
            year: 'numeric'
          }).format(date)
          groups.set(month_key, { month_key, month_label, date_groups: new Map() })
        }
        const month_group = groups.get(month_key)
        if (!month_group.date_groups.has(entry.date)) {
          month_group.date_groups.set(entry.date, { date: entry.date, entries: [] })
        }
        month_group.date_groups.get(entry.date).entries.push(entry)
      }

      return Array.from(groups.values()).map((group) => ({
        month_key: group.month_key,
        month_label: group.month_label,
        date_groups: Array.from(group.date_groups.values())
      }))
    }
  },
  methods: {
    entryTitle(entry) {
      return this.$i18n.locale === 'fr' ? entry.title_fr : entry.title_en
    },
    entryBody(entry) {
      const body = this.$i18n.locale === 'fr' ? entry.body_fr : entry.body_en
      return body || ''
    },
    formatEntryDate(date_str) {
      const locale = this.$i18n.locale === 'fr' ? 'fr-FR' : 'en-US'
      return new Intl.DateTimeFormat(locale, {
        day: 'numeric',
        month: 'short'
      }).format(new Date(date_str))
    }
  }
}
</script>
<style lang="scss" scoped>
._changelogContent {
  padding: 1rem;
  font-size: 0.9rem;
}

._empty {
  color: var(--color-text-secondary);
}

._monthGroup {
  margin-bottom: 1.5rem;

  &:last-child {
    margin-bottom: 0;
  }
}

._monthLabel {
  position: sticky;
  top: 0;
  z-index: 1;
  margin: 0 0 0.5rem;
  padding: 0.35rem 0 0.25rem;
  font-size: 0.85rem;
  font-weight: 700;
  text-transform: capitalize;
  color: var(--color-text-secondary);
  background: var(--color-background);
}

._dateGroups {
  list-style: none;
  margin: 0;
  padding: 0;
}

._dateGroup {
  padding: 0.65rem 0;
  border-bottom: 1px solid var(--color-gray-light);

  &:last-child {
    border-bottom: none;
  }
}

._entries {
  list-style: none;
  margin: 0.35rem 0 0;
  padding: 0 0 0 0.75rem;
  border-left: 2px solid var(--color-gray-light);
}

._entry {
  padding: 0.45rem 0 0.45rem 0.65rem;

  &:not(:last-child) {
    border-bottom: 1px dashed var(--color-gray-light);
  }
}

._entryMeta {
  display: flex;
  flex-flow: row wrap;
  align-items: center;
  gap: 0.5rem;
}

._entryDate {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-text-secondary);
  font-variant-numeric: tabular-nums;
}

._type {
  display: inline-block;
  padding: 0.1rem 0.4rem;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.02em;
  border-radius: 0.2rem;
  background: var(--color-gray-light);
  color: var(--color-text-secondary);

  &[data-type='bike'] {
    background: #e8f4e8;
    color: #2d5a2d;
  }
  &[data-type='ui'] {
    background: #e8eef8;
    color: #2d3d5a;
  }
  &[data-type='fix'] {
    background: #f8f0e8;
    color: #5a4a2d;
  }
  &[data-type='release'] {
    background: #f0e8f8;
    color: #4a2d5a;
  }
}

._entryTitle {
  display: block;
  margin-top: 0.35rem;
  font-size: 0.95rem;
}

._entryBody {
  margin: 0.35rem 0 0;
  color: var(--color-text-secondary);
  line-height: 1.4;
}
</style>
