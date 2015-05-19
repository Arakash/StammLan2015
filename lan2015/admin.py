from django.contrib import admin

from lan2015.models import Announcement
from lan2015.models import Comment

# Register your models here.

class AnnouncementAdmin(admin.ModelAdmin):
    fields = ['header', 'text', 'pub_date']
    list_display = ('header', 'text', 'pub_date')


class CommentAdmin(admin.ModelAdmin):
    fields = ['userName', 'text', 'pub_date', 'color']
    list_display = ('userName', 'text', 'pub_date', 'color')

admin.site.register(Comment, CommentAdmin)
admin.site.register(Announcement, AnnouncementAdmin)
