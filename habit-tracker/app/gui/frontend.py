#!/usr/bin/env python3

"""
One line description of the Package or Module

This module provides functionallity for [continue...]

Packages
--------
"""

# -=-=- Imports and Globals -=-=- #

from flask import Flask, render_template, request, jsonify, current_app
import sqlite3
import threading
import webview
from . import tasks
from os import path as os_path

# Compute absolute paths to templates and static directories
BASE_DIR = os_path.dirname(os_path.abspath(__file__))       # app/gui
TEMPLATE_DIR = os_path.join(BASE_DIR, "www", "templates")   # app/gui/www/templates
STATIC_DIR = os_path.join(BASE_DIR, "www", "static")       # app/gui/www/static

# Tell Flask where to find templates and static files
APP = Flask(__name__, template_folder=TEMPLATE_DIR, static_folder=STATIC_DIR)


# -=-=- Helper Function -=-=- #

def render_macro(template_name, macro_name, **kwargs):
    """Render a songle macro from a template - IMO this should be a feature of flask but whatever."""
    env = current_app.jinja_env
    tmpl = env.get_template(template_name)
    macro = tmpl.module.__dict__[macro_name]
    return macro(**kwargs)


# -=-=- Flask routes -=-=- #

@APP.route('/')
def index():
    # return render_template("index.html", tasks={})
    # all_tasks = tasks.get_all_tasks(active_only=True)
    all_tasks = tasks.get_all_tasks()
    return render_template("index.html", tasks=all_tasks)

@APP.route('/add', methods=['POST'])
def add():
    name = request.json.get('name', '').strip()
    if not name:
        return jsonify({'success': False, 'error': 'Empty name'}), 400
    task_id = tasks.create_task(name)
    new_task = tasks.get_task(task_id)
    html = render_macro("_task.html", "render_task", task=new_task)
    return jsonify({'success': True, 'id': task_id, 'html': html})

@APP.route('/delete/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    try:
        tasks.delete_task(task_id)
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@APP.route('/set_active/<int:task_id>', methods=['POST'])
def set_active(task_id):
    try:
        active = request.json.get('active', True)
        tasks.set_task_active(task_id, active)
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@APP.route('/debug')
def debug():
    all_tasks = tasks.get_all_tasks()
    for task in all_tasks:
        task['logs'] = tasks.get_task_logs(task['id'], limit=5)

    return render_template("debug_tasks.html", all_tasks=all_tasks)


# -=-=- Settings -=-=- #

@APP.route('/settings', methods=['GET'])
def settings():
    settings = tasks.get_settings()
    return render_template("settings.html", settings=settings)

@APP.route('/settings', methods=['POST'])
def save_settings():
    data = request.json
    tasks.set_settings(**data)
    return jsonify({'success': True})

# -=-=- Startup functions -=-=- #

def start_server(host: str = '127.0.0.1', port: int = 6900):
    APP.run(host=host, port=port, threaded=True)

def start_UI():
    # Add a sample task if DB is empty
    if not tasks.get_all_tasks():
        tasks.create_task("Sample Task ✅")
    
    threading.Thread(target=start_server, daemon=True).start()
    webview.create_window("Habit Tracker", "http://127.0.0.1:6900", width=900, height=600)
    webview.start()

# EOF #
