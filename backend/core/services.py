from .models import UserSkill


class MatchService:
    WEIGHTS = {'required': 2, 'nice': 1}
    MAX_LEVEL = 3

    def __init__(self, user, job):
        self.user = user
        self.job = job

    def run(self):
        user_levels = {
            us.skill_id: us.level
            for us in UserSkill.objects.filter(user=self.user)
        }

        earned = 0
        total = 0
        matched, missing = [], []

        for js in self.job.skills.select_related('skill'):
            weight = self.WEIGHTS[js.importance]
            total += weight * self.MAX_LEVEL
            level = user_levels.get(js.skill_id, 0)
            earned += weight * level

            entry = {
                'skill': js.skill.name,
                'importance': js.importance,
                'your_level': level,
            }
            (matched if level else missing).append(entry)

        missing.sort(key=lambda e: e['importance'] != 'required')
        score = round(earned / total * 100, 1) if total else 0.0

        return {
            'job': self.job.title,
            'match_score': score,
            'matched_skills': matched,
            'missing_skills': missing,
        }