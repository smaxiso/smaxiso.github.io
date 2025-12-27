import sys
import os
from datetime import datetime

# Add the parent directory to sys.path
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.database import SessionLocal
from app.models import schemas

def seed_post():
    db = SessionLocal()
    
    title = "How I Got Google Antigravity Working Perfectly with WSL"
    slug = "google-antigravity-wsl-guide"
    excerpt = "As a Data Engineer, I spend most of my life in the terminal. Whether I'm optimizing Spark queries or building Python-based Gen AI tools, Windows Subsystem for Linux (WSL) is non-negotiable."
    tags = "Antigravity,WSL,Engineering,GenAI"
    
    content = """# How I Got Google Antigravity Working Perfectly with WSL

**By Sumit Kumar (smaxiso)**

As a Data Engineer, I spend most of my life in the terminal. Whether I'm optimizing Spark queries or building Python-based Gen AI tools, **Windows Subsystem for Linux (WSL)** is non-negotiable. It gives me the ecosystem of Linux with the convenience of Windows.

Recently, I started exploring **Google Antigravity**, Google’s new agent-first IDE. It’s a powerful tool for building AI agents, but I ran into a snag immediately: it didn't play nice with my WSL setup out of the box.

If you’re like me and trying to run Linux scripts or Python agents inside Antigravity on Windows, here is the quick fix (and a few pro tips) that got my environment stable.

---

### The Problem

I opened a project workspace in Antigravity on Windows. The interface looked great (very VS Code-like), but when I asked the AI agent to run a simple bash script or a Python file, it choked.

The error was usually:

> `Invalid command line argument...`

Basically, the Windows-based agent was trying to execute Linux commands and failing. I looked for a "WSL Extension" in the marketplace, but the standard Microsoft one wasn't there.

### The Solution: Switch Context, Don't Install

It turns out you don't need a new extension. You just need to tell Antigravity to look at the "Linux" side of your machine.

1. Open Antigravity.
2. Press `Ctrl+Shift+P` (Command Palette).
3. Type and select: **`Remote-WSL: Connect to WSL`**.

**Important Note:** When the new window opens, make sure you open your project folder using the Linux path (e.g., `~/projects/my-ai-tool`) rather than the Windows mount path (`\\\\wsl.localhost\\...`). This ensures the agent has the correct file permissions.

Once I did this, I could ask the agent: *"Run the setup script"* and it executed perfectly inside my Ubuntu environment.

---

### Pro Tip: Fixing the CLI (`agy`)

I prefer launching tools from the terminal. If you try to run `antigravity .` from your WSL terminal, it defaults to the Windows version.

To fix this, you need to trick it into using the correct remote extension.

1. **Create a Symlink:**
```bash
ln -sf "/mnt/c/Users/<YOUR_USER>/AppData/Local/Programs/Antigravity/bin/antigravity" ~/.local/bin/agy
```

2. **Edit the Config:** You need to edit the `antigravity` bin file in Windows to force the `google.antigravity-remote-wsl` extension ID. (Refer to the original guide below for the specific line edit).

### Pro Tip: The Browser Subagent

If you are building agents that need to browse the web (like I do for some of my scraping tools), the agent might fail to connect to Chrome because of networking issues between WSL and Windows.

The quickest fix is enabling **Mirrored Networking** in WSL.
Add this to your `%userprofile%\\.wslconfig` file in Windows:

```ini
[wsl2]
networkingMode=mirrored
```

After a restart, the Antigravity agent in WSL could control my Chrome browser flawlessly.

---

### Final Thoughts

Antigravity is looking like a solid addition to my toolkit, especially for rapid prototyping of Gen AI ideas. Now that it’s talking to WSL correctly, I can get back to building.

*Huge thanks to Dazbo (Darren Lester) for the [original deep-dive article](https://www.google.com/search?q=https://medium.com/google-cloud/working-with-google-antigravity-in-wsl-2b2df077a28e) that helped me figure this out.*"""

    # Check if exists
    existing = db.query(schemas.BlogPost).filter(schemas.BlogPost.slug == slug).first()
    if existing:
        print(f"Post '{slug}' already exists. Updating...")
        existing.content = content
        existing.title = title
        existing.excerpt = excerpt
        existing.tags = tags
        existing.published = True
    else:
        print(f"Creating new post '{slug}'...")
        new_post = schemas.BlogPost(
            title=title,
            slug=slug,
            content=content,
            excerpt=excerpt,
            tags=tags,
            cover_image="https://res.cloudinary.com/dnggn7f7b/image/upload/v1734192419/project_cli_tool_cover_1765728459865.png", # Reusing a techy cover image I know exists or generic
            published=True,
            created_at=datetime.utcnow().isoformat()
        )
        db.add(new_post)
    
    db.commit()
    print("Success!")
    db.close()

if __name__ == "__main__":
    seed_post()
