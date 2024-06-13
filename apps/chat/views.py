import json
from django.shortcuts import render
from .models import Message, Room
from django.views.generic.detail import DetailView


# Create your views here.
def home(request):
    messages = Message.objects.all()
    rooms = Room.objects.all()

    return render(request, "chat/home.html", {"rooms": rooms, "messages": messages})


class RoomDetailView(DetailView):
    model = Room
    template_name = "chat/list-messages.html"

    def get_context_data(self, **kwargs):
        context = super().get_context_data(**kwargs)
        return context


def send_message(request, pk):
    data = json.loads(request.body)
    room = Room.objects.get(id=pk)
    new_message = Message.objects.create(user=request.user, text=data["message"])
    room.messages.add(new_message)
    return render(request, "chat/message.html", {"message": new_message})


def create_room(request):
    data = json.loads(request.body)
    print(data)
    # room = Room.objects.create(user=request.user, title=data["title"])
    # return render(request, "chat/room.html", {"room": room})
