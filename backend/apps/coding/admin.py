from django.contrib import admin
from .models import CodingSession

# Register your models here.
admin.site.register(CodingSession)


class CodingSessionAdmin(admin.ModelAdmin):
    readonly_fields = ('credits_awarded')
