#!/usr/bin/env python3

"""
One line description of the Package or Module

This module provides functionallity for [continue...]

Packages
--------
"""

# -=-=- Imports and Globals -=-=- #

from flask import Flask, render_template, request, jsonify
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

# -=-=- Flask routes -=-=- #

@APP.route('/')
def index():
    # return render_template("index.html", tasks={})
    all_tasks = tasks.get_all_tasks(active_only=True)
    return render_template("index.html", tasks=all_tasks)

@APP.route('/add', methods=['POST'])
def add():
    name = request.json.get('name', '').strip()
    if not name:
        return jsonify({'success': False, 'error': 'Empty name'}), 400
    task_id = tasks.create_task(name)
    return jsonify({'success': True, 'id': task_id})

@APP.route('/delete/<int:task_id>', methods=['DELETE'])
def delete_task(task_id):
    try:
        tasks.delete_task(task_id)
        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'success': False, 'error': str(e)}), 500

@APP.route('/debug')
def debug():
    all_tasks = tasks.get_all_tasks(active_only=False)
    debug_html = "<h3>Tasks and Logs</h3>"
    debug_html += "<a href='/'>Back</a>"
    for t in all_tasks:
        debug_html += f"<h4>#{t['id']}: {t['name']}</h4><ul>"
        logs = tasks.get_task_logs(t['id'], limit=5)
        if logs:
            for l in logs:
                debug_html += f"<li>{l['completed_at']} - {l.get('notes', '')}</li>"
        else:
            debug_html += "<li>No completions yet</li>"
        debug_html += "</ul>"
    return debug_html

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
