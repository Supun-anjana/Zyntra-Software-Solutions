import re

with open("about.html", "r", encoding="utf-8") as f:
    content = f.read()

# 1. Fix tailwind config
old_config = """          colors: {
            base: '#05060f',
            card: '#0d0f1e',
            border: 'rgba(0, 245, 255, 0.12)',
            cyan: '#8b5cf6',
            purple: '#4f46e5',
            magenta: '#e11d90',
            blue: '#6366f1',
            green: '#10b981',
            primary: '#f0f2ff',
            secondary: '#8892b0',
            muted: '#4a5568',
            glass: 'rgba(13, 15, 30, 0.7)',
          },"""
new_config = """          colors: {
            base: '#0E1217',
            card: '#1C1F26',
            border: 'rgba(255, 255, 255, 0.08)',
            cyan: '#00D1FF',
            purple: '#A57CFF',
            magenta: '#FF5A92',
            blue: '#3B82F6',
            green: '#22C55E',
            primary: '#FFFFFF',
            secondary: '#A9ADC1',
            muted: '#71768B',
            glass: 'rgba(28, 31, 38, 0.7)',
          },"""
content = content.replace(old_config, new_config)

# 2. Body class
content = content.replace(
    'selection:bg-purple selection:text-white',
    'selection:bg-cyan selection:text-white page-entrance'
)

# 3. Logo Gradients
content = content.replace('stop-color="#8b5cf6"', 'stop-color="#00D1FF"')
content = content.replace('stop-color="#4f46e5"', 'stop-color="#A57CFF"')
content = content.replace('stop-color="#e11d90"', 'stop-color="#FF5A92"')

# 4. Buttons
old_desktop_btn = 'px-6 py-2.5 rounded-full bg-gradient-to-r from-cyan to-purple text-sm font-bold text-white shadow-glow-cyan hover:shadow-glow-cyan-lg hover:-translate-y-0.5 transition-all duration-300 inline-block'
new_desktop_btn = 'px-6 py-2.5 rounded-full btn-primary text-sm font-bold inline-block'
content = content.replace(old_desktop_btn, new_desktop_btn)

old_mobile_btn = 'px-8 py-4 rounded-full bg-gradient-to-r from-cyan to-purple text-lg font-bold text-white shadow-glow-cyan'
new_mobile_btn = 'px-8 py-4 rounded-full btn-primary text-lg font-bold'
content = content.replace(old_mobile_btn, new_mobile_btn)

# 5. Hero section grid
content = content.replace(
    'rgba(79,70,229,0.03)',
    'rgba(165,124,255,0.05)'
)
content = content.replace(
    'bg-purple/10 blur-[120px]',
    'bg-purple/5 blur-[100px]'
)

# 6. Mission/Vision/Values Cards
content = content.replace(
    'reveal p-10 rounded-[32px] bg-card border border-cyan/10 hover:border-cyan/30 transition-all duration-300 hover:-translate-y-2 group',
    'daily-card p-10 group reveal'
)
content = content.replace(
    'reveal anim-delay-100 p-10 rounded-[32px] bg-card border border-purple/10 hover:border-purple/30 transition-all duration-300 hover:-translate-y-2 group',
    'daily-card p-10 group reveal anim-delay-100'
)
content = content.replace(
    'reveal anim-delay-200 p-10 rounded-[32px] bg-card border border-magenta/10 hover:border-magenta/30 transition-all duration-300 hover:-translate-y-2 group',
    'daily-card p-10 group reveal anim-delay-200'
)

# 7. Leadership cards (use regex to catch all variants of hover color borders)
content = re.sub(
    r'bg-base border border-white/5 rounded-3xl p-8 transition-all duration-300 hover:border-[a-z0-9\-]+/30 hover:scale-\[1\.02\] shadow-glass',
    'daily-card p-8 group',
    content
)

# 8. Culture stat grid items
content = re.sub(
    r'bg-card p-6 rounded-3xl border border-white/5 shadow-glass flex flex-col items-center justify-center text-centeraspect-square h-48 sm:-translate-y-8 border-[a-z0-9\-]+/20',
    'daily-card p-6 flex flex-col items-center justify-center h-48 sm:-translate-y-8 group',
    content
)

content = re.sub(
    r'bg-card p-6 rounded-3xl border border-white/5 shadow-glass flex flex-col items-center justify-center text-centeraspect-square h-48 border-[a-z0-9\-]+/20',
    'daily-card p-6 flex flex-col items-center justify-center h-48 group',
    content
)

# Add gradients inside mission/vision/values cards
def add_gradient_to_cards(match):
    return match.group(0) + '\n        <div class="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>'

content = re.sub(r'(<div\s+class="daily-card\s+[^>]*>)\s*(<div\s+class="w-16 h-16)', add_gradient_to_cards, content)

# 9. Home page link in About
content = content.replace('<a href="index.html" class="text-sm font-medium text-secondary hover:text-white transition-colors">Home</a>', '<a href="index.html" class="text-sm font-medium text-secondary hover:text-white transition-colors">Home</a>')


with open("about.html", "w", encoding="utf-8") as f:
    f.write(content)

print("Updated about.html successfully.")
