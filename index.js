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
    project = db.get('projects').find({name: name}).value()
    if (project == undefined) {
        return false
    }
    return true
}

function getTasks() {
    let name = db.get('default').value()
    let project = db.get('projects').find({name: name})
    tasks = project.get('tasks').map("title").value()

    tasks.forEach(task => {
        taskName = chalk.magentaBright(task)
        console.log(taskName)
    })
}

function addTask() {

    let name = db.get('default').value()
    let project = db.get('projects').find({name: name})

    inquirer.prompt([{
        type: "input",
        name: "task",
        message: "task "
    }]).then(name => {
        name = name["task"]
        project.get("tasks").push({
            title: name,
            completed: false
        }).write()
    })
}

function createProject() {
    defaultProj = db.get('default').value()
    let projName = ""

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

        if (!projectExists(defaultProj)) {
            db.set('default', projName).write()
        }

        var success = chalk.green("project created!\nset a new default project with 'todo set'")
        console.log(success)
        
    })
}

function setDefault() {
    var projects = db.get('projects').map("name").value()

    inquirer.prompt([{
        type: "list",
        name: "project",
        choices: projects
    }]).then(project => {
        let name = project['project']
        db.set('default', name).write()
    })
}

switch(args[2]) {
    case undefined:
        getTasks()
        break
    case "n":
        addTask()
        break
    case "np":
        createProject()
        break
    case "set":
        setDefault()
        break
    default:
        break
}
