from django.apps import AppConfig


class CodingConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'apps.coding'

    def ready(self):
        import apps.coding.signals
