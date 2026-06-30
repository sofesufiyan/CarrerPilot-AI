logs = []


def add(message):
    logs.append(message)


def get_logs():
    return logs


def clear():
    logs.clear()