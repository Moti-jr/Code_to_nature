from rest_framework import serializers
from .models import Activity
from datetime import date
class ActivitiesSerializer(serializers.ModelSerializer):
    class Meta:
        model = Activity
        fields = ['id', 'user', 'duration', 'verification_proof','status', 'location', 'activity_date', 'description', 'activity']
        read_only_field= ['id', 'user']
        
        def validate_verification_proof(self, value):
            max_size = 2 * 1024 * 1024
            if value.size > max_size:
                raise serializers.ValidationError('Invalid image size')
            
            allowed_mime_types = ['image/jpeg', 'image/png']
            if value.content_type not in allowed_mime_types:
                raise serializers.ValidationError('Only png or jpeg formats are allowed')
            
            
            from PIL import Image
            img = Image.open(value)
            if img.width > 2000 or img.height > 2000:
                raise serializers.ValidationError("Image dimensions too large")

            return value
                    
        def validate_activity_date(self, value):
            if value > date.today():
                raise serializers.ValidationError("Cannot add an activity of a future date")
            return value