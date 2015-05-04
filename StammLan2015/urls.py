from django.conf.urls import patterns, include, url
from django.contrib import admin
from lan2015 import views

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'StammLan2015.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
    url(r'^2015/', include('lan2015.urls')),
)
