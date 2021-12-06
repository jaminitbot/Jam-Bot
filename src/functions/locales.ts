import i18next from 'i18next'
import i18nextBackend from 'i18next-fs-backend'
import { capitaliseSentence } from './util'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(duration)
dayjs.extend(relativeTime)

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
                if (format === 'duration')
                    return dayjs.duration(value, 'ms').humanize()
            },
        },
    })
}
