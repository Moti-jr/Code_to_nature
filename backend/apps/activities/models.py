from django.db import models
from apps.users.models import CustomUser
from datetime import date, time
from auditlog.registry import auditlog
# Create your models here.


class Activity(models.Model):
    user = models.ForeignKey(CustomUser, null=False, on_delete=models.CASCADE)
    duration = models.TimeField(null=False, default=time(0, 0))
    verification_proof = models.ImageField(upload_to='activities/', null=False)
    statuses = [
        ('PENDING' , 'pending'),
        ('VERIFIED' , 'verified'),
        ('REJECTED', 'rejected')
    ]
    status = models.CharField(
        choices=statuses,
        default='PENDING',
        max_length=12)
    verified_on = models.DateTimeField(null=True)
    location = models.CharField(max_length=70, null=True)
    activity_date = models.DateField(default=date.today)
    description = models.TextField(null=True)
    activities = [
        ('hiking', 'hiking'),
        ('walking', 'walking'),
        ('running', 'running'),
        ('cycling', 'cycling'),
        ('climbing', 'climbing'),
        ('camping', 'camping'),
        ('gardening', 'gardening'),
        ('other', 'other')
    ]
    activity = models.CharField(max_length=25, choices=activities, null=False)

    
    class Meta:
        verbose_name_plural = 'Activities'

    def __str__(self):
        return f"{self.user.username}-{self.activity}-{self.status}"
    
auditlog.register(Activity)