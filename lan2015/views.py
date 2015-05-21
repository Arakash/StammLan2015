from django.shortcuts import render
from django.utils import timezone
from django.http import HttpResponse
from datetime import datetime

from lan2015.models import Announcement, Subscriber
from lan2015.models import Comment

from django.views.decorators.csrf import csrf_exempt

import json

# Create your views here.


def index(request):
    return render(request, 'lan2015/login.html')


@csrf_exempt
def main(request):
    announcements = Announcement.objects.order_by('pub_date');
    comments = Comment.objects.order_by('pub_date');
    subscribers = Subscriber.objects.all();
    context = {'announcements': announcements, 'comments': comments, 'subscribers': subscribers}
    return render(request, 'lan2015/stammlan-2015/index.html', context)


@csrf_exempt
def sendComment(request):
    results = {}
    if request.method == 'POST':
        commentName = request.POST.get('commentName')
        commentText = request.POST.get('commentText')
        commentColor= request.POST.get('commentColor')

        c = Comment()
        c.userName = commentName
        c.text = commentText
        c.color= commentColor
        c.pub_date = timezone.now()

        c.save()
        results['commentName'] = c.userName
        results['commentText'] = c.text
        results['commentColor']= c.color
        results['commentDate'] = c.pub_date.strftime("%Y-%m-%d %H:%M")

    j = json.dumps(results)
    return HttpResponse(j, content_type='application/json')


@csrf_exempt
def sendSubscriber(request):
    results= {}
    if request.method == 'POST':
        subName = request.POST.get('subName')

        subArrival = request.POST.get('subArrival')
        subArrival = datetime.strptime(subArrival, "%d.%m.%Y")
        subDeparture= request.POST.get('subDeparture')
        subDeparture = datetime.strptime(subDeparture, "%d.%m.%Y")
        subSwitch = request.POST.get('subSwitch')

        s = Subscriber()
        s.name = subName
        s.arrival = subArrival
        s.departure = subDeparture
        s.switch = subSwitch

        s.save()

        results['subName'] = subName
        results['subArrival'] = subArrival.__str__()
        results['subDeparture']=subDeparture.__str__()
        results['subSwitch'] = subSwitch

    j = json.dumps(results)
    return HttpResponse(j, content_type='application/json')
