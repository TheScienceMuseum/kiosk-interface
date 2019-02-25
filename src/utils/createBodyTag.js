/*
 * createBodyTag:
 *  Take a single string/aray of strings and return
 *  individual p tags for each.
 *  Allows array of lines in JSON
 *
 * @author Sam Anderson <sam@joipolloi.com.
 * @package BBC-SecretOfHappiness
 */

module.exports = (body, tagClass = '', tag = 'p') => {
    const lines = Array.isArray(body) ? body : body.split('\n');
    const markup = lines.map(line => `<${tag} class=${tagClass}>${line}</${tag}>`);
    return markup.join('');
};
