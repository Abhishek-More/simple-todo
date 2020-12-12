#!/usr/bin/env node

const chalk = require("chalk")
const inquirer = require("inquirer")
const low = require('lowdb')

const args = process.argv
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)

db.defaults({default: "", projects: []}).write()
console.log()

function projectExists(name) {
    project = db.get('projects').find({name: name})

    if (project) {
        return true
    }
    return false
}

function getTasks() {
    let name = db.get('default').value()
    let project = db.get('projects').find({name: name})
    tasks = project.get('tasks').map("title").value()
    if (tasks.length == 0) {
        err = chalk.red("default project not found\ntry creating one with 'todo np'")
        console.log(err)  
    } else {
        name = chalk.magentaBright(name)
        console.log(name)
    }
}

function createProject() {
    defaultProj = db.get('default').value()
    inquirer.prompt([{
        type: "input",
        name: "project",
        message: "project name"
    }]).then(name => {
        projName = name['project']
        db.get('projects').push({
            name: projName,
            tasks: []
        }).write()
    })

}

switch(args[2]) {
    case undefined:
        getTasks()
        break
    case "np":
        createProject()
        break
    default:
        break
}
