from django.db import models
from apps.users.models import CustomUser
from datetime import date
from auditlog.registry import auditlog
# Create your models here.
class Activity(models.Model):


    user = models.ForeignKey(CustomUser, null=False, on_delete=models.CASCADE)
    duration = models.IntegerField(null=False)
    verification_proof = models.ImageField(upload_to='activities/', null=False)
    statuses = [
        ('PENDING' , 'pending'),
        ('VERIFIED' , 'verified'),
        ('REJECTED', 'rejected')
    ]
    status = models.CharField(choices=statuses, default='PENDING')
    verified_on = models.DateTimeField(null=True)
    location = models.CharField(max_length=70, null=True)
    activity_date = models.DateField(default=date.today)
    description = models.TextField(null=True)
    activity = models.CharField(max_length=50, default='Other')

    
    class Meta:
        verbose_name_plural = 'Activities'
auditlog.register(Activity)