from django.conf.urls import patterns, url

from lan2015 import views

urlpatterns = patterns('',
    #url(r'main', views.main, name='main'),
    #url(r'^$', views.index, name='index'),
    url(r'^$', views.main, name='main'),
    url(r'^sendComment/$', views.sendComment),
    url(r'^sendSubscriber/$', views.sendSubscriber),
)
