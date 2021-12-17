import i18next from 'i18next'
import i18nextBackend from 'i18next-fs-backend'
import { capitaliseSentence } from './util'
import { formatDistanceToNowStrict, format as formatDate } from 'date-fns'

export async function initTranslations() {
    await i18next.use(i18nextBackend).init({
        lng: 'en',
        ns: ['general', 'commands', 'events', 'misc'],
        defaultNS: 'commands',
        backend: {
            loadPath: __dirname + '/..' + '/..' + '/locales' + '/{{lng}}' + '/{{ns}}.json'
        },
        interpolation: {
            escapeValue: false,
            format: function (value, format, lng) {
                if (format === 'capitalise') return capitaliseSentence(value)
                if (format === 'duration') return formatDistanceToNowStrict(Date.now() - value, { roundingMethod: 'ceil' })
                if (format === 'durationPrefix') return formatDistanceToNowStrict(Date.now() + value, { addSuffix: true, roundingMethod: 'ceil' })
                if (format === 'date') return formatDate(value, 'HH:mm - dd/MM/yyyy')
            },
        },
    })
}
