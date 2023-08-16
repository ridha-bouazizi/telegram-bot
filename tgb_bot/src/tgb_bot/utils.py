import logging
import os
import re
from typing import Optional
from flask import g

import pexpect

def run_command_in_thread(command):
    child = pexpect.spawn(command, timeout=120)
    child.expect(pexpect.EOF)
    g.output = child.before.decode('utf-8')
    g.child = child

def cleanup(*files: str) -> None:
    """Delete the file names passed as args."""
    for file in files:
        try:
            os.remove(file)
        except FileNotFoundError:
            logging.info(f"File {file} does not exist, so cant delete it.")

def match(pattern: str, string: str, regex: bool) -> bool:
    if regex:
        return bool(re.findall(pattern, string))
    return pattern in string


def replace(pattern: str, new: str, string: str, regex: bool) -> str:
    return string.replace(pattern, new)

