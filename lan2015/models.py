from django.db import models

# Create your models here.

class Announcement(models.Model):
    header = models.CharField(max_length=80)
    text = models.TextField(max_length=800)
    pub_date = models.DateTimeField('date published')

    def __str__(self):
        return self.header.__str__()

class Comment(models.Model):
    userName = models.CharField(max_length=30)
    text = models.CharField(max_length=100)
    color = models.CharField(max_length=9)
    pub_date = models.DateTimeField('date published')

class Subscriber(models.Model):
    name = models.CharField(max_length=45)
    arrival = models.DateTimeField('arrival')
    departure=models.DateTimeField('departure')
    switch = models.CharField(max_length=80)
    other = models.CharField(max_length=450)
