import NavigationBar from "../components/NavigationBar";

function StudentHomePage({ profile }) {
  return (
    <>
      <NavigationBar profile={profile} />
      <main className="px-4 pt-6">
        <section className="flex items-start gap-3">
          <div className="w-[100px] h-[100px] bg-gray-200 flex items-center justify-center">
            <span className="text-white text-2xl font-bold">?</span>
          </div>
          <div>
            <h2 className="font-bold text-lg">{`${profile.first_name} ${profile.last_name} [${profile.user_role}]`}</h2>
            <p className="text-sm">{profile.email}</p>
          </div>
        </section>
      </main>
    </>
  );
}

export default StudentHomePage;
