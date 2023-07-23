# A python class for collecting os env vars with prefix 'TGB_'
import os
from typing import Dict


class EnvVars:
    def __init__(self, env_vars: Dict[str, str]):
        self.env_vars = env_vars

    @staticmethod
    def get_env_vars() -> "EnvVars":
        env_vars: Dict[str, str] = {}
        prefix: str = "TGB_"
        for key, value in os.environ.items():
            if key[:len(prefix)] == prefix:
                env_vars[key[len(prefix):]] = value
        return EnvVars(env_vars)


if __name__ == "__main__":
    env_vars = EnvVars
    print(env_vars.get_env_vars().env_vars)