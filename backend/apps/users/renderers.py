from rest_framework.renderers import JSONRenderer


class BooleanRenderer(JSONRenderer):
    """Wrap Response in Boolean"""

    def render(self, data, accepted_media_type=None, renderer_context=None):
        response = renderer_context.get(
            "response"
        )if renderer_context else None

        success = True
        if response:
            success = response.status_code < 400

        if isinstance(data, dict) and "success" not in data:
            data = {
                "success": success,
                "data": data
            }
        elif not isinstance(data, dict):
            data = {
                "success": success,
                "data": data
            }
        return super().render(data, accepted_media_type, renderer_context)
