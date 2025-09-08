# rewards/admin.py
from django.contrib import admin
from django.utils.html import format_html
from django.db.models import Count, Sum
from .models import Reward, Redemption


@admin.register(Reward)
class RewardAdmin(admin.ModelAdmin):
    list_display = [
        'name', 'category', 'cost', 'available', 'popular', 
        'redemption_count', 'created_at'
    ]
    list_filter = ['category', 'available', 'popular', 'created_at']
    search_fields = ['name', 'description']
    list_editable = ['available', 'popular']
    readonly_fields = ['created_at', 'redemption_count']
    
    fieldsets = (
        ('Basic Information', {
            'fields': ('name', 'description', 'cost', 'category')
        }),
        ('Display & Availability', {
            'fields': ('icon', 'available', 'popular')
        }),
        ('Timestamps', {
            'fields': ('created_at',),
            'classes': ('collapse',)
        }),
        ('Statistics', {
            'fields': ('redemption_count',),
            'classes': ('collapse',)
        }),
    )
    
    def redemption_count(self, obj):
        """Show how many times this reward has been redeemed."""
        count = obj.redemptions.count()
        if count > 0:
            return format_html(
                '<span style="color: green; font-weight: bold;">{}</span>',
                count
            )
        return count
    redemption_count.short_description = 'Times Redeemed'
    
    def get_queryset(self, request):
        """Optimize queries by prefetching redemptions."""
        return super().get_queryset(request).prefetch_related('redemptions')


@admin.register(Redemption)
class RedemptionAdmin(admin.ModelAdmin):
    list_display = [
        'user', 'reward_name', 'reward_category', 'cost', 
        'date', 'formatted_date'
    ]
    list_filter = ['reward__category', 'date', 'reward']
    search_fields = ['user__username', 'user__email', 'reward__name']
    readonly_fields = ['date', 'user_profile_link', 'reward_details']
    date_hierarchy = 'date'
    
    fieldsets = (
        ('Redemption Details', {
            'fields': ('user', 'reward', 'cost', 'date')
        }),
        ('Additional Information', {
            'fields': ('user_profile_link', 'reward_details'),
            'classes': ('collapse',)
        }),
    )
    
    def reward_name(self, obj):
        """Display reward name with color coding by category."""
        colors = {
            'environmental': 'green',
            'merchandise': 'blue',
            'digital': 'purple'
        }
        color = colors.get(obj.reward.category, 'black')
        return format_html(
            '<span style="color: {}; font-weight: bold;">{}</span>',
            color,
            obj.reward.name
        )
    reward_name.short_description = 'Reward'
    
    def reward_category(self, obj):
        """Display reward category."""
        return obj.reward.get_category_display()
    reward_category.short_description = 'Category'
    
    def formatted_date(self, obj):
        """Display formatted date."""
        return obj.date.strftime('%b %d, %Y at %I:%M %p')
    formatted_date.short_description = 'Date & Time'
    
    def user_profile_link(self, obj):
        """Link to user's profile in admin."""
        if obj.user:
            return format_html(
                '<a href="/admin/auth/user/{}/change/">{} ({})</a>',
                obj.user.id,
                obj.user.get_full_name() or obj.user.username,
                obj.user.email
            )
        return '-'
    user_profile_link.short_description = 'User Profile'
    
    def reward_details(self, obj):
        """Show reward details."""
        return format_html(
            '<strong>Cost:</strong> {} eco-credits<br>'
            '<strong>Available:</strong> {}<br>'
            '<strong>Popular:</strong> {}',
            obj.reward.cost,
            'Yes' if obj.reward.available else 'No',
            'Yes' if obj.reward.popular else 'No'
        )
    reward_details.short_description = 'Reward Info'
    
    def has_add_permission(self, request):
        """Redemptions should only be created through the API."""
        return False
    
    def has_change_permission(self, request, obj=None):
        """Redemptions should generally not be editable."""
        return request.user.is_superuser
    
    def get_queryset(self, request):
        """Optimize queries."""
        return super().get_queryset(request).select_related('user', 'reward')


# Custom admin actions
@admin.action(description='Mark selected rewards as popular')
def make_popular(modeladmin, request, queryset):
    updated = queryset.update(popular=True)
    modeladmin.message_user(
        request, f'{updated} rewards marked as popular.'
    )

@admin.action(description='Mark selected rewards as not popular')
def make_not_popular(modeladmin, request, queryset):
    updated = queryset.update(popular=False)
    modeladmin.message_user(
        request, f'{updated} rewards marked as not popular.'
    )

@admin.action(description='Make selected rewards unavailable')
def make_unavailable(modeladmin, request, queryset):
    updated = queryset.update(available=False)
    modeladmin.message_user(
        request, f'{updated} rewards made unavailable.'
    )

# Add actions to RewardAdmin
RewardAdmin.actions = [make_popular, make_not_popular, make_unavailable]