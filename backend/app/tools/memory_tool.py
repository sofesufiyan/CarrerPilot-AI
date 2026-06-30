memory = {}


def save(key, value):
    memory[key] = value


def load(key):
    return memory.get(key)


def clear():
    memory.clear()


def all_memory():
    return memory