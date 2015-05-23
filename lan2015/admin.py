from django.contrib import admin

from lan2015.models import Announcement
from lan2015.models import Comment, Subscriber


# Register your models here.

class AnnouncementAdmin(admin.ModelAdmin):
    fields = ['header', 'text', 'pub_date']
    list_display = ('header', 'text', 'pub_date')


class CommentAdmin(admin.ModelAdmin):
    fields = ['userName', 'text', 'pub_date', 'color']
    list_display = ('userName', 'text', 'pub_date', 'color')

class SubscriberAdmin(admin.ModelAdmin):
    fields = ['name', 'arrival','departure', 'switch', 'other']
    list_display = ('name', 'arrival','departure', 'switch', 'other')

admin.site.register(Comment, CommentAdmin)
admin.site.register(Announcement, AnnouncementAdmin)
admin.site.register(Subscriber, SubscriberAdmin)
