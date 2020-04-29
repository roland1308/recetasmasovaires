import { languages } from '../components/languages'

function changeLanguage(lang) {
    let payload = ""
    switch (lang) {
        case "English":
            payload = languages().eng
            break;
        case "Italiano":
            payload = languages().ita
            break;
        case "Español":
            payload = languages().esp
            break;
        case "Català":
            payload = languages().cat
            break;
        default:
            break;
    }
    return payload
}
export default (changeLanguage)