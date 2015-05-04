from django.shortcuts import render
from django.utils import timezone
from django.http import HttpResponse

from lan2015.models import Announcement
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
    context = {'announcements': announcements, 'comments': comments}
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
