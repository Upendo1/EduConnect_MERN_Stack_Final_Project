export default function AuthHeader({ title }) {
  return (
    <div className="text-center mb-6">
      <h1 className="text-4xl font-extrabold text-blue-700 tracking-tight mb-1">
        EduConnect
      </h1>
      <h2 className="text-2xl font-semibold text-gray-800">{title}</h2>
      <p className="text-gray-500 text-sm mt-1">
        Empowering education through seamless connection
      </p>
    </div>
  );
}
