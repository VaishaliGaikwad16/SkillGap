from django.conf import settings
from django.db import models


class Skill(models.Model):
    name = models.CharField(max_length=100, unique=True)
    category = models.CharField(max_length=50, blank=True)

    def __str__(self):
        return self.name


class UserSkill(models.Model):
    LEVELS = [(1, 'Beginner'), (2, 'Intermediate'), (3, 'Advanced')]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE)
    level = models.PositiveSmallIntegerField(choices=LEVELS, default=1)

    class Meta:
        unique_together = ('user', 'skill')


class JobDescription(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=150)
    company = models.CharField(max_length=150, blank=True)
    raw_text = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class JobSkill(models.Model):
    IMPORTANCE = [('required', 'Required'), ('nice', 'Nice to have')]

    job = models.ForeignKey(JobDescription, on_delete=models.CASCADE, related_name='skills')
    skill = models.ForeignKey(Skill, on_delete=models.CASCADE)
    importance = models.CharField(max_length=10, choices=IMPORTANCE, default='required')

    class Meta:
        unique_together = ('job', 'skill')


class ReadinessSnapshot(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    job = models.ForeignKey(JobDescription, on_delete=models.CASCADE)
    match_score = models.FloatField()
    created_at = models.DateTimeField(auto_now_add=True)