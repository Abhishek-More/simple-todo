#!/usr/bin/env node

const chalk = require("chalk")
const inquirer = require("inquirer")
const low = require('lowdb')

const args = process.argv
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)

const print = console.log

db.defaults({default: "", projects: []}).write()

function usage() {

    const usageText = `
        todo helps you manage your todo tasks.
    
        usage:
        todo <command>
    
        commands can be:
    
        new:      used to create a new todo
        get:      used to retrieve your todos
        complete: used to mark a todo as complete
        help:     used to print the usage guide
    `

    console.log(usageText)
}

function errorLog(error) {
    const err = chalk.red(error)
    console.log(err)
}

function newProject() {
    inquirer.prompt([{
        type: "input",
        name: "project",
        message: "project name?"
    }]).then(name => {
        projName = name['project']
        db.get('projects').push({
            name: projName,
            tasks: []
        }).write()
    })
}

function newTask() {
    inquirer.prompt([{
        type: "input",
        name: "task",
        message: "task name?"
    }]).then(name => {
        taskName = name['project']
        db.get('tasks').push({
            task: taskName,
            complete: false
        }).write()
    })
}

function chooseType() {
    inquirer.prompt([{
        type: "list",
        name: "type",
        message: "type:",
        choices: ["task", "project", "cancel"]
    }]).then(type => {
        type = type["type"]
        if(type == "project") {
            newProject()
        } else if (type == "task") {
            newTask()
        }
    })
}

function getProjList() {
    const projects = db.get('projects').value()
    console.log()
    projects.forEach(project => {
        name = chalk.magentaBright(project["name"])
        console.log('\t' + name)
    });
}

function getAll() {
    const projects = db.get('projects').take(5).value()
    const tasks = db.get('tasks').take(5).value()

    console.log()
    projectText = chalk.blueBright.bold("projects")
    console.log(projectText)
    projects.forEach(project => {
        name = chalk.green(project["name"])
        console.log('\t' + name)
    });
}

function chooseProject() {

    var projects = db.get('projects').take(5).value()

    inquirer.prompt([{
        type: "list",
        name: "project",
        choices: projects
    }]).then(project => {
        let name = project["project"]
        viewProject(name)
    })
}

function viewProject(name) {
    var project = db.get('projects').find({name: name})
    let tasks = ["new"].concat(project.get('tasks').map("title").value())
    console.log()

    inquirer.prompt([{
        type: "checkbox",
        name: "task",
        choices: tasks
    }]).then(task => {
        console.log(task)
    })
}


if (args.length > 3) {
    errorLog("only one argument can be accepted")
    usage()
}

switch(args[2]) {
    case undefined:
        getProjList()
        break
    case 'help':
        usage()
        break
    case 's':
        chooseProject()
        break
    case 'n':
        newProject()
        break
    case 'l':
        getProjList()
        break
    case 'peek':
        getAll()
        break
    default:
        errorLog('invalid command passed')
        usage()
}
