import argparse
import re
import subprocess

argparser = argparse.ArgumentParser()
argparser.add_argument("--env-file", required=True)

args = argparser.parse_args()


def get_secrets_from_env_file(env_file):
    """
    Set secrets from a file containing key=value pairs.

    :param env_file: Path to the file containing the key=value pairs.
    """

    kv_pairs = {}

    with open(args.env_file) as f:
        for line in f:
            line = line.strip()
            if not line or line.startswith("#"):
                continue
            key, value = line.split("=", 1)
            if value == "":
                continue
            stripped_value = re.sub("[\"']", "", value)

            kv_pairs[key] = stripped_value
    return kv_pairs


def fly_deploy(secrets):
    """
    Set secrets for fly.

    :param kv_pairs: A dictionary containing key=value pairs.
    """
    build_secrets = []
    for key, value in secrets.items():
        build_secrets.extend(["--build-secret", f"{key}={value}"])
        print(f"Set secret {key}")

    command = ["flyctl", "deploy"]
    command.extend(build_secrets)
    subprocess.run(command)


if __name__ == "__main__":
    env_values = get_secrets_from_env_file(args.env_file)
    fly_deploy(env_values)
