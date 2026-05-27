const ID_TYPE_ENV_KEYS = {
    CC:  "REACT_APP_ID_TYPE_CC",
    CE:  "REACT_APP_ID_TYPE_CE",
    TI:  "REACT_APP_ID_TYPE_TI",
    PP:  "REACT_APP_ID_TYPE_PP",
    NIT: "REACT_APP_ID_TYPE_NIT",
};

function resolveIdTypeUuid(code) {
    const envKey = ID_TYPE_ENV_KEYS[code];
    const uuid = envKey ? process.env[envKey] : null;
    if (!uuid) {
        throw new Error(
            `Tipo de documento "${code}" sin UUID configurado. ` +
            `Define ${envKey} en el archivo .env con el UUID de la base de datos.`
        );
    }
    return uuid;
}

function resolveIdTypeCode(uuid) {
    if (!uuid) return "CC";
    for (const [code, envKey] of Object.entries(ID_TYPE_ENV_KEYS)) {
        if (process.env[envKey] === uuid) return code;
    }
    return "CC";
}

export function toWorkerDto(employee) {
    return {
        name:        employee.fullName?.trim(),
        idType:      resolveIdTypeUuid(employee.idType),
        idNumber:    employee.idNumber,
        phoneNumber: employee.phone,
        mail:        employee.email,
        address:     employee.address,
    };
}

export function fromWorkerDto(worker) {
    return {
        id:            worker.id,
        fullName:      worker.name,
        idType:        resolveIdTypeCode(worker.idType),
        idNumber:      worker.idNumber,
        phone:         worker.phoneNumber,
        phoneVerified: true,
        email:         worker.mail,
        emailVerified: true,
        address:       worker.address,
    };
}

export function paginateWorkers(workers, { page = 0, size = 10, search = "" } = {}) {
    let list = workers;
    if (search) {
        const q = search.toLowerCase();
        list = list.filter(
            (w) =>
                w.fullName?.toLowerCase().includes(q) ||
                w.idNumber?.includes(q)
        );
    }
    const total = list.length;
    return {
        content:       list.slice(page * size, (page + 1) * size),
        totalElements: total,
        totalPages:    Math.ceil(total / size) || 1,
        page,
    };
}
