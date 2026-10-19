import pandas as pd

from .models import JobSkill, UserSkill, ReadinessSnapshot


def top_missing_skills(user):
    my_skill_ids = set(
        UserSkill.objects.filter(user=user).values_list('skill_id', flat=True)
    )

    rows = JobSkill.objects.filter(job__user=user).values(
        'skill_id', 'skill__name', 'importance'
    )
    df = pd.DataFrame(list(rows))
    if df.empty:
        return []

    df = df[~df['skill_id'].isin(my_skill_ids)]
    if df.empty:
        return []

    df['points'] = df['importance'].map({'required': 2, 'nice': 1})

    summary = (
        df.groupby('skill__name')
        .agg(jobs_needing=('skill_id', 'count'), priority_score=('points', 'sum'))
        .reset_index()
        .sort_values(['priority_score', 'jobs_needing'], ascending=False)
        .rename(columns={'skill__name': 'skill'})
    )
    return summary.to_dict(orient='records')


def progress_over_time(user):
    rows = ReadinessSnapshot.objects.filter(user=user).values(
        'created_at', 'match_score', 'job__title'
    )
    df = pd.DataFrame(list(rows))
    if df.empty:
        return []

    df = df.sort_values('created_at')
    df['created_at'] = df['created_at'].dt.strftime('%Y-%m-%d %H:%M')
    df = df.rename(columns={'job__title': 'job'})
    return df.to_dict(orient='records')