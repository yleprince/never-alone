export default function fillWithDefault(options, defaultOption) {
    for (let attr in defaultOption) {
        if (defaultOption.hasOwnProperty(attr) && !options.hasOwnProperty(attr)) {
            options[attr] = defaultOption[attr];
        }
    }
    return options;
}
