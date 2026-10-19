import json
import os
import re

from .models import Skill


def keyword_extract(text):
    text_l = text.lower()
    found = []
    for s in Skill.objects.all():
        pattern = r'(?<![a-z0-9+#])' + re.escape(s.name.lower()) + r'(?![a-z0-9+#])'
        if re.search(pattern, text_l):
            found.append({'name': s.name, 'importance': 'required'})
    return found


def ai_extract(text):
    import anthropic

    client = anthropic.Anthropic()
    prompt = (
        'Read this job description and list the technical skills it asks for. '
        'Use short standard names like "Python", "React", "MySQL", "Docker". '
        'Mark each skill "required" or "nice" (nice to have). '
        'Reply with ONLY a JSON array like '
        '[{"name": "Python", "importance": "required"}] and nothing else.\n\n'
        f'Job description:\n{text}'
    )
    msg = client.messages.create(
        model='claude-haiku-5-5',
        max_tokens=800,
        messages=[{'role': 'user', 'content': prompt}],
    )
    raw = re.sub(r'```json|```', '', msg.content[0].text).strip()
    items = json.loads(raw)

    cleaned = []
    for item in items:
        name = str(item.get('name', '')).strip()
        if not name:
            continue
        importance = 'nice' if item.get('importance') == 'nice' else 'required'
        cleaned.append({'name': name, 'importance': importance})
    return cleaned


def extract_skills(text):
    if os.environ.get('ANTHROPIC_API_KEY'):
        try:
            return ai_extract(text), 'ai'
        except Exception as e:
            print('AI extraction failed, using keywords:', e)
    return keyword_extract(text), 'keywords'