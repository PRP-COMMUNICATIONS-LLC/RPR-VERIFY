import os, sys
def atomic_write(file_path, content):
    os.makedirs(os.path.dirname(file_path) or '.', exist_ok=True)
    temp_path = file_path + ".tmp"
    try:
        with open(temp_path, "w", encoding='utf-8') as f:
            f.write(content)
            f.flush()
            os.fsync(f.fileno())
        os.replace(temp_path, file_path)
        return True
    except Exception as e:
        if os.path.exists(temp_path): os.remove(temp_path)
        print(f"Error: {e}"); sys.exit(1)
if __name__ == "__main__":
    content = " ".join(sys.argv[2:]).replace("\\n", "\n")
    atomic_write(sys.argv[1], content)
