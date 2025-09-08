from datetime import timedelta
from rest_framework import serializers
from .models import CodingSession


class CodingSessionSerializer(serializers.ModelSerializer):
    """Coding Session Serializer"""
    class Meta:
        model = CodingSession
        fields = [
            'user',
            'duration',
            'source',
            'created_at',
            'credits_awarded'
        ]

    def create(self, validated_data):
        """Create coding session automatically if source
        is github otherwise create manually
        """
        source = validated_data.get('source')
        user = validated_data.get('user')
        if source == 'github':
            temp_session = CodingSession(
                user=user,
                source=source
            )
            duration = temp_session.get_duration_from_github()
            validated_data['duration'] = duration if duration else timedelta()

        return super().create(validated_data)
