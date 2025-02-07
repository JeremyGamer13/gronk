const fetch = require("node-fetch");

// TODO: none of this works with the new api lol
class ProjectApi {
    constructor(pv, username) {
        this.privateCode = pv;
        this.username = username;
    }

    static getProjects(page) {
        return new Promise((resolve, reject) => {
            const url = `https://projects.penguinmod.com/api/projects/getApproved?page=${page}`;
            fetch(url)
                .then((res) => {
                    if (!res.ok) {
                        res.text().then(reject);
                        return;
                    }
                    res.json().then((projectList) => {
                        resolve(projectList.projects);
                    });
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }
    static getMaxProjects(count, onlyFeatured, hideFeatured) {
        return new Promise((resolve, reject) => {
            const url = `https://projects.penguinmod.com/api/projects/max?amount=${count}` + (onlyFeatured ? '&featured=true' : '') + (hideFeatured ? '&hidefeatured=true' : '');
            fetch(url)
                .then((res) => {
                    if (!res.ok) {
                        res.text().then(reject);
                        return;
                    }
                    res.json().then((projects) => {
                        resolve(projects);
                    }).catch(reject);
                })
                .catch((err) => {
                    reject(err);
                });
        })
    }

    /**
     * @param {string} user username
     * @param {number} page page
     * @returns Array of projects
     */
    static getUserProjects(user, page) {
        return new Promise((resolve, reject) => {
            const url = `https://projects.penguinmod.com/api/projects/search?page=${page}&user=${user}`;
            fetch(url)
                .then((res) => {
                    if (!res.ok) {
                        res.text().then(reject);
                        return;
                    }
                    res.json().then((projectList) => {
                        resolve(projectList.projects);
                    });
                })
                .catch((err) => {
                    reject(err);
                });
        })
    }

    /**
     * @param {string} query query
     * @param {number} page page
     * @returns Array of projects
     */
    static searchProjects(query, page) {
        return new Promise((resolve, reject) => {
            const url = `https://projects.penguinmod.com/api/projects/search?page=${page}&includes=${query}`;
            fetch(url)
                .then((res) => {
                    if (!res.ok) {
                        res.text().then(reject);
                        return;
                    }
                    res.json().then((projectList) => {
                        resolve(projectList.projects);
                    });
                })
                .catch((err) => {
                    reject(err);
                });
        })
    }

    static getProjectMeta(id) {
        return new Promise((resolve, reject) => {
            const url = `https://projects.penguinmod.com/api/projects/getPublished?id=${id}`;
            fetch(url)
                .then((res) => {
                    if (!res.ok) {
                        res.text().then(reject);
                        return;
                    }
                    res.json().then((project) => {
                        resolve(project);
                    });
                })
                .catch((err) => {
                    reject(err);
                });
        })
    }
    static getProjectRemixes(id) {
        return new Promise((resolve, reject) => {
            const url = `https://projects.penguinmod.com/api/pmWrapper/remixes?id=${id}`;
            fetch(url)
                .then((res) => {
                    if (!res.ok) {
                        res.text().then(reject);
                        return;
                    }
                    res.json().then((projectList) => {
                        resolve(projectList.projects);
                    });
                })
                .catch((err) => {
                    reject(err);
                });
        })
    }

    static getProjectFile(id) {
        return new Promise((resolve, reject) => {
            const url = `https://projects.penguinmod.com/api/projects/getPublished?type=file&id=${id}`;
            fetch(url)
                .then((res) => {
                    if (!res.ok) {
                        res.text().then(reject);
                        return;
                    }
                    res.arrayBuffer().then((blob) => {
                        resolve(blob);
                    });
                })
                .catch((err) => {
                    reject(err);
                });
        })
    }

    static isAdmin(username) {
        return new Promise((resolve, reject) => {
            const url = `https://projects.penguinmod.com/api/users/isAdmin?username=${username}`;
            fetch(url)
                .then((res) => {
                    if (!res.ok) {
                        res.text().then(reject);
                        return;
                    }
                    res.json().then((result) => {
                        resolve(result.admin);
                    });
                })
                .catch((err) => {
                    reject(err);
                });
        })
    }

    setPrivateCode(p) {
        this.privateCode = p;
    }
    setUsername(u) {
        this.username = u;
    }

    getMyProjects(page) {
        return new Promise((resolve, reject) => {
            const url = `https://projects.penguinmod.com/api/users/getMyProjects?page=${page}&user=${this.username}&code=${this.privateCode}&sorted=true`;
            fetch(url)
                .then((res) => {
                    if (!res.ok) {
                        res.text().then(reject);
                        return;
                    }
                    res.json().then((projectList) => {
                        resolve(projectList.projects);
                    });
                })
                .catch((err) => {
                    reject(err);
                });
        })
    }
    getUnapprovedProjects(page) {
        return new Promise((resolve, reject) => {
            const url = `https://projects.penguinmod.com/api/projects/getUnapproved?page=${page}&user=${this.username}&passcode=${this.privateCode}`;
            fetch(url)
                .then((res) => {
                    if (!res.ok) {
                        res.text().then(reject);
                        return;
                    }
                    res.json().then((projectList) => {
                        const projects = projectList.projects;
                        const shown = projects.filter(p => !p.hidden);
                        resolve(shown);
                    });
                })
                .catch((err) => {
                    reject(err);
                });
        })
    }
    deleteProject(id) {
        return new Promise((resolve, reject) => {
            fetch(`https://projects.penguinmod.com/api/projects/delete?passcode=${this.privateCode}&approver=${this.username}&id=${id}`).then(res => {
                res.json().then(json => {
                    if (!res.ok) {
                        reject(json.error);
                        return;
                    }
                    resolve();
                }).catch(err => {
                    reject(err);
                })
            }).catch(err => {
                reject(err);
            })
        })
    }
    updateProject(id, newData) {
        newData.id = id;
        newData.requestor = this.username;
        newData.passcode = this.privateCode;
        if (typeof newData.newMeta === "object") {
            newData.newMeta = JSON.stringify(newData.newMeta);
        }
        return new Promise((resolve, reject) => {
            fetch(
                `https://projects.penguinmod.com/api/projects/update`,
                {
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(newData),
                    method: "POST"
                }
            ).then(res => {
                res.json().then(json => {
                    if (!res.ok) {
                        reject(json.error);
                        return;
                    }
                    resolve();
                }).catch(err => {
                    reject(err);
                })
            }).catch(err => {
                reject(err);
            })
        })
    }
    uploadProject(data) {
        data.author = this.username;
        data.passcode = this.privateCode;
        return new Promise((resolve, reject) => {
            fetch(
                `https://projects.penguinmod.com/api/projects/publish`,
                {
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(data),
                    method: "POST"
                }
            ).then(res => {
                res.json().then(json => {
                    if (!res.ok) {
                        reject(json.error);
                        return;
                    }
                    resolve(json.published);
                }).catch(err => {
                    reject(err);
                })
            }).catch(err => {
                reject(err);
            })
        })
    }

    approveProject(id, webhook) {
        const url = `https://projects.penguinmod.com/api/projects/approve?passcode=${this.privateCode}&approver=${this.username}&webhook=${webhook}&id=${id}`;
        return new Promise((resolve, reject) => {
            fetch(url).then(res => {
                res.json().then(json => {
                    if (!res.ok) {
                        reject(json.error);
                        return;
                    }
                    resolve();
                }).catch(err => {
                    reject(err);
                })
            }).catch(err => {
                reject(err);
            })
        })
    }
    featureProject(id, webhook) {
        const url = `https://projects.penguinmod.com/api/projects/feature?passcode=${this.privateCode}&approver=${this.username}&webhook=${webhook}&id=${id}`;
        return new Promise((resolve, reject) => {
            fetch(url).then(res => {
                res.json().then(json => {
                    if (!res.ok) {
                        reject(json.error);
                        return;
                    }
                    resolve();
                }).catch(err => {
                    reject(err);
                })
            }).catch(err => {
                reject(err);
            })
        })
    }

    toggleVoteProject(id, type) {
        type = String(type).toLowerCase().trim();
        switch (type) {
            case 'feature':
            case 'features':
            case 'featured':
            case 'vote':
            case 'voted':
                type = 'votes';
                break;
            case 'love':
            case 'loved':
            case 'like':
            case 'liked':
            case 'likes':
                type = 'loves';
                break;
            default:
                type = 'votes';
        }
        const url = `https://projects.penguinmod.com/api/projects/toggleProjectVote`;
        return new Promise((resolve, reject) => {
            fetch(url, {
                headers: { "Content-Type": "application/json" },
                method: "POST",
                body: JSON.stringify({
                    id: id,
                    type: type,
                    user: this.username,
                    passcode: this.privateCode
                })
            }).then(res => {
                res.json().then(json => {
                    if (!res.ok) {
                        reject(json.error);
                        return;
                    }
                    resolve(json.state);
                }).catch(err => {
                    reject(err);
                })
            }).catch(err => {
                reject(err);
            })
        })
    }
    getVoteStates(id) {
        const url = `https://projects.penguinmod.com/api/projects/getProjectVote?user=${this.username}&passcode=${this.privateCode}&id=${id}`;
        return new Promise((resolve, reject) => {
            fetch(url).then(res => {
                res.json().then(json => {
                    if (!res.ok) {
                        reject(json.error);
                        return;
                    }
                    resolve(json);
                }).catch(err => {
                    reject(err);
                })
            }).catch(err => {
                reject(err);
            })
        })
    }
}

module.exports = ProjectApi;