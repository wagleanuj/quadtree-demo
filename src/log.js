const INFO = 0;
const ERROR = 1;

export const log = (message, type = null) => {
    const styles = {
        generic: 'color: #2196F3;',
        error: 'color: #F32121;',
        code: 'color: #FAFAFA; background: #333333; border-radius: 3px;' +
            'padding: 2px 4px; font-family: "SFMono-Regular", Consolas, ' +
            'Courier, monospace;',
    };

    const d = new Date();
    const time = [ d.getHours(), d.getMinutes(), d.getSeconds() ];
    const generic = type === INFO ? styles.generic : styles.error;
    const all = [ generic ];

    for (let i = 0; i < 3; i++) {
        time[i] = time[i] < 10 ? `0${time[i]}` : time[i];
    }

    let msg = `[${time.join(':')}] %c${message}`;

    // Apply Code styling.
    msg = msg.replace(/`(.*?)`/g, str => {
        str = str.replace(new RegExp('`', 'g'), '');
        all.push(styles.code);
        all.push(generic);

        return `%c${str}%c`;
    });

    console.log(msg, ...all);
};

export { INFO as INFO };
export { ERROR as ERROR };
