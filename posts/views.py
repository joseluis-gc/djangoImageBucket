from django.shortcuts import render
from .models import Post
from django.http import JsonResponse
from .forms import PostForm
from  profiles.models import Profile

# from django.core import serializers


# Create your views here.
def post_list_and_create(request):
    form = PostForm(request.POST or None)

    # qs = Post.objects.all()

    if request.is_ajax():
        author = Profile.objects.get(user=request.user)
        instance = form.save(commit=False)
        instance.author = author
        instance.save()
        return JsonResponse({
            'title': instance.title,
            'body': instance.body,
            'author': instance.author.user.username,
            'id':instance.id
        })

    context = {
        'form': form,
    }
    # return render(request, 'posts/main.html', {'qs': qs})
    return render(request, 'posts/main.html', context)


def load_posts_data_view(request, **kwargs):
    if request.is_ajax():
        num_posts = kwargs.get('num_posts')
        visible = 3
        upper = num_posts
        lower = upper - visible
        size = Post.objects.all().count()

        qs = Post.objects.all()
        # data = serializers.serialize('json', qs)
        data = []
        for obj in qs:
            item = {
                'id': obj.id,
                'title': obj.title,
                'body': obj.body,
                'liked': True if request.user in obj.liked.all() else False,
                'count': obj.like_count,
                'author': obj.author.user.username
            }
            data.append(item)

        return JsonResponse({'data': data[lower:upper], 'size': size})


def like_unlike_post(request):
    if request.is_ajax():
        pk = request.POST.get('pk')
        obj = Post.objects.get(pk=pk)
        if request.user in obj.liked.all():
            liked = False
            obj.liked.remove(request.user)
        else:
            liked = True
            obj.liked.add(request.user)
        return JsonResponse({'liked': liked, 'count': obj.like_count})


def hello_world_view(request):
    return JsonResponse({'text': 'Hello World'})


def post_detail(request, pk):
    obj = Post.objects.get(pk=pk)
    form = PostForm()

    context = {
        'obj': obj,
        'form': form,
    }

    return render(request, 'posts/post-detail.html', context)


def post_detail_data_view(request, pk):
    obj = Post.objects.get(pk=pk)
    data = {
        'id': obj.id,
        'title': obj.title,
        'body': obj.body,
        'author': obj.author.user.username,
        'logged_in': request.user.username,
    }

    return JsonResponse({'data': data})

