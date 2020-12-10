#!/usr/bin/env node

const chalk = require("chalk")
const inquirer = require("inquirer")
const low = require('lowdb')

const args = process.argv
const FileSync = require('lowdb/adapters/FileSync')
const adapter = new FileSync('db.json')
const db = low(adapter)

db.defaults({projects: []}).write()

function usage() {

    const usageText = `
        todo helps you manage you todo tasks.
    
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

function addProj() {
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

function getProjList() {
    const projects = db.get('projects').value()
    console.log()
    projects.forEach(project => {
        name = chalk.magentaBright(project["name"])
        console.log('\t' + name)
    });
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
    case 'new':
        addProj()
        break
    case 'ls':
        getProjList()
        break
    case 'complete':
        break
    default:
        errorLog('invalid command passed')
        usage()
}